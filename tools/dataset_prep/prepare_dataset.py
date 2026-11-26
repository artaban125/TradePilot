#!/usr/bin/env python3
"""Company Documents v2 데이터셋 다운로드 + 정제 스크립트 (Eye2Text / TradePilot).

원본: https://huggingface.co/datasets/AyoubChLin/Company-document-dataset-v2  (Apache-2.0)

하는 일
  1) download : 필요한 문서 종류만 Hugging Face에서 고정 버전으로 내려받는다 (중단 후 재실행 시 이어받기)
  2) organize : 원하는 언어의 문서만 골라 종류·split별 파일로 정리한다
                <out>/data/<type>/<split>.parquet    PDF + 원본 전체 컬럼
                <out>/scans/<type>/<split>.parquet   해당 문서의 스캔 이미지 (--no-scans 로 생략)
                <out>/labels/<type>/<split>.jsonl    {"doc_id", "gold"}  (정답 JSON만)
                <out>/summary.json                   건수 + 출처 + 버전 + 실행 옵션
                <out>/dataset_summary.md             사람이 읽는 요약 표
  3) verify   : 정리 결과 건수를 원본과 다시 대조한다

사용 예
  # 기본값: 영문 5종(송장·발주서·견적서·선적지시서·포장명세서), 스캔 포함
  python prepare_dataset.py

  # 송장만, 영어+프랑스어, 스캔 제외, 경로 지정
  python prepare_dataset.py --types invoice --locales en fr --no-scans \
      --raw /data/raw/company_docs_v2 --out /data/company_docs_v2_invoice

  # 빠른 동작 확인: 발주서 test split만
  python prepare_dataset.py --types purchase_order --splits test

  # 이미 받아 둔 원본으로 정제만 다시
  python prepare_dataset.py --skip-download

  # 결과를 지우고 처음부터 다시 정제
  python prepare_dataset.py --skip-download --force

필요 패키지: pyarrow>=14, huggingface_hub>=0.23  (requirements.txt 참고)
Python 3.9 이상, Windows / Linux / macOS 모두 동작.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import logging
import shutil
import sys
import time
from pathlib import Path

try:
    import pyarrow as pa
    import pyarrow.compute as pc
    import pyarrow.parquet as pq
    from huggingface_hub import snapshot_download
except ImportError as e:  # pragma: no cover
    sys.exit(f"필요한 패키지가 없습니다: {e.name}\n  pip install -r requirements.txt")

REPO_ID = "AyoubChLin/Company-document-dataset-v2"
DEFAULT_REVISION = "0e9f5198e7e09f858834e544f96ec12436fdbb5e"  # 2026-10-07 공개 버전

ALL_TYPES = [
    "account_statement", "credit_note", "employment_certificate", "goods_received_note",
    "inventory_report", "invoice", "packing_slip", "payslip", "purchase_order", "quote",
    "receipt", "shipping_order", "work_order",
]
DEFAULT_TYPES = ["invoice", "purchase_order", "quote", "shipping_order", "packing_slip"]
TYPE_KO = {
    "invoice": "송장", "purchase_order": "발주서", "quote": "견적서", "shipping_order": "선적지시서",
    "packing_slip": "포장명세서", "credit_note": "대변표", "receipt": "영수증",
    "goods_received_note": "입고확인서", "account_statement": "거래명세서", "work_order": "작업지시서",
    "inventory_report": "재고보고서", "payslip": "급여명세서", "employment_certificate": "재직증명서",
}
ALL_SPLITS = ["train", "validation", "test"]
SPLITS = list(ALL_SPLITS)  # --splits 로 바뀜

log = logging.getLogger("prepare_dataset")


# --------------------------------------------------------------------------- download
def download(raw: Path, types: list[str], revision: str, with_scans: bool, workers: int) -> None:
    patterns = ["README.md", "stats.json", "licenses/*"]
    dirs = ["data", "scans"] if with_scans else ["data"]
    patterns += [f"{d}/{t}/*" for d in dirs for t in types]
    log.info("다운로드 시작: %s@%s  종류=%s  스캔=%s -> %s", REPO_ID, revision[:7], types, with_scans, raw)
    t0 = time.time()
    snapshot_download(REPO_ID, repo_type="dataset", revision=revision, local_dir=str(raw),
                      allow_patterns=patterns, max_workers=workers)
    log.info("다운로드 완료: %.0f초", time.time() - t0)


# --------------------------------------------------------------------------- organize
def _filter_docs(raw: Path, out: Path, t: str, split: str, locales: list[str]) -> tuple[int, set]:
    """문서 parquet 에서 원하는 언어만 골라 쓰고, 정답 JSONL 도 함께 만든다."""
    files = sorted((raw / "data" / t).glob(f"{split}-*.parquet"))
    if not files:
        raise FileNotFoundError(f"원본 파일이 없습니다: {raw / 'data' / t}/{split}-*.parquet")
    loc_set = pa.array(locales)
    tmp_pq = out / "data" / t / f"{split}.parquet.tmp"
    tmp_lab = out / "labels" / t / f"{split}.jsonl.tmp"
    writer, n, ids = None, 0, set()
    with open(tmp_lab, "w", encoding="utf-8") as lab:
        for f in files:
            for b in pq.ParquetFile(f).iter_batches(batch_size=500):
                b = b.filter(pc.is_in(b.column("locale"), value_set=loc_set))
                if b.num_rows == 0:
                    continue
                if writer is None:
                    writer = pq.ParquetWriter(tmp_pq, b.schema, compression="zstd")
                writer.write_batch(b)
                n += b.num_rows
                for d, e in zip(b.column("doc_id").to_pylist(), b.column("extracted_data").to_pylist()):
                    ids.add(d)
                    lab.write(json.dumps({"doc_id": d, "gold": json.loads(e)}, ensure_ascii=False) + "\n")
    if writer:
        writer.close()
        tmp_pq.replace(out / "data" / t / f"{split}.parquet")
    tmp_lab.replace(out / "labels" / t / f"{split}.jsonl")
    return n, ids


def _filter_scans(raw: Path, out: Path, t: str, split: str, ids: set) -> int:
    files = sorted((raw / "scans" / t).glob(f"{split}-*.parquet"))
    if not files or not ids:
        return 0
    id_set = pa.array(sorted(ids))
    tmp = out / "scans" / t / f"{split}.parquet.tmp"
    writer, m = None, 0
    for f in files:
        for b in pq.ParquetFile(f).iter_batches(batch_size=200):
            b = b.filter(pc.is_in(b.column("doc_id"), value_set=id_set))
            if b.num_rows == 0:
                continue
            if writer is None:
                writer = pq.ParquetWriter(tmp, b.schema, compression="zstd")
            writer.write_batch(b)
            m += b.num_rows
    if writer:
        writer.close()
        tmp.replace(out / "scans" / t / f"{split}.parquet")
    return m


def organize(raw: Path, out: Path, types: list[str], locales: list[str], with_scans: bool,
             revision: str, force: bool) -> dict:
    state_file = out / ".progress.json"
    if force and out.exists():
        log.info("--force: 기존 결과 삭제 %s", out)
        shutil.rmtree(out)
    done = json.loads(state_file.read_text()) if state_file.exists() else {}

    counts: dict = {}
    for t in types:
        counts[t] = {}
        for sub in (["data", "labels"] + (["scans"] if with_scans else [])):
            (out / sub / t).mkdir(parents=True, exist_ok=True)
        for s in SPLITS:
            key = f"{t}/{s}"
            if key in done:  # 이미 끝난 조각은 건너뜀 (재실행 시 이어서)
                counts[t][s] = done[key]
                log.info("건너뜀(완료됨) %-15s %-10s 문서=%6d 스캔=%6d", t, s, done[key]["documents"], done[key]["scan_pages"])
                continue
            n, ids = _filter_docs(raw, out, t, s, locales)
            m = _filter_scans(raw, out, t, s, ids) if with_scans else 0
            counts[t][s] = done[key] = {"documents": n, "scan_pages": m}
            state_file.write_text(json.dumps(done, indent=1))
            log.info("정리      %-15s %-10s 문서=%6d 스캔=%6d", t, s, n, m)

    summary = {
        "source": REPO_ID, "revision": revision, "locales": locales, "types": types,
        "splits": list(SPLITS), "with_scans": with_scans, "created_at": dt.datetime.now().isoformat(timespec="seconds"),
        "counts": counts,
        "total_documents": sum(v["documents"] for c in counts.values() for v in c.values()),
        "total_scan_pages": sum(v["scan_pages"] for c in counts.values() for v in c.values()),
    }
    (out / "summary.json").write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
    _write_markdown(out, summary)
    state_file.unlink(missing_ok=True)
    return summary


def _write_markdown(out: Path, s: dict) -> None:
    c = s["counts"]
    lines = [
        "# 데이터셋 정리 현황", "",
        f"- 출처: [{s['source']}](https://huggingface.co/datasets/{s['source']}) (Apache-2.0)",
        f"- 버전: `{s['revision']}`",
        f"- 언어: {', '.join(s['locales'])} / 스캔 포함: {'예' if s['with_scans'] else '아니오'}",
        f"- 생성: {s['created_at']}", "",
        "| 종류 | 문서 (train / val / test) | 스캔 페이지 (train / val / test) |", "|---|---|---|",
    ]
    for t, v in c.items():
        d = " / ".join(f"{v[x]['documents']:,}" for x in SPLITS)
        sc = " / ".join(f"{v[x]['scan_pages']:,}" for x in SPLITS)
        lines.append(f"| {t}({TYPE_KO.get(t, t)}) | {d} | {sc} |")
    td = " / ".join(f"{sum(c[t][x]['documents'] for t in c):,}" for x in SPLITS)
    ts = " / ".join(f"{sum(c[t][x]['scan_pages'] for t in c):,}" for x in SPLITS)
    lines.append(f"| **합계** | **{td}** (총 {s['total_documents']:,}) | **{ts}** (총 {s['total_scan_pages']:,}) |")
    lines += ["", "## 폴더 구조", "```",
              "data/<종류>/<split>.parquet    PDF + 원본 전체 컬럼",
              "scans/<종류>/<split>.parquet   스캔 이미지 (doc_id 로 문서와 연결)",
              "labels/<종류>/<split>.jsonl    {\"doc_id\", \"gold\"} 한 줄에 문서 1건",
              "summary.json                  건수 + 출처 + 버전 + 옵션", "```"]
    (out / "dataset_summary.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


# --------------------------------------------------------------------------- verify
def verify(raw: Path, out: Path, summary: dict) -> bool:
    """원본에서 언어 조건으로 다시 센 건수와 결과 파일 건수가 같은지 확인한다."""
    ok = True
    loc = set(summary["locales"])
    for t, per in summary["counts"].items():
        for s, v in per.items():
            expect = 0
            for f in sorted((raw / "data" / t).glob(f"{s}-*.parquet")):
                col = pq.read_table(f, columns=["locale"]).column("locale").to_pylist()
                expect += sum(1 for x in col if x in loc)
            got_pq = pq.ParquetFile(out / "data" / t / f"{s}.parquet").metadata.num_rows if v["documents"] else 0
            with open(out / "labels" / t / f"{s}.jsonl", encoding="utf-8") as fh:
                got_lab = sum(1 for _ in fh)
            got_scan = (pq.ParquetFile(out / "scans" / t / f"{s}.parquet").metadata.num_rows
                        if summary["with_scans"] and v["scan_pages"] else 0)
            good = expect == got_pq == got_lab == v["documents"] and got_scan == v["scan_pages"]
            ok &= good
            log.info("검증 %s %-15s %-10s 원본=%6d 문서=%6d 정답=%6d 스캔=%6d",
                     "OK  " if good else "FAIL", t, s, expect, got_pq, got_lab, got_scan)
    return ok


# --------------------------------------------------------------------------- main
def parse_args(argv=None):
    ap = argparse.ArgumentParser(description="Company Documents v2 다운로드 + 정제",
                                 formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    ap.add_argument("--raw", type=Path, default=Path("data/raw/company_docs_v2"), help="원본 저장 폴더")
    ap.add_argument("--out", type=Path, default=Path("data/company_docs_v2_en"), help="정제 결과 폴더")
    ap.add_argument("--types", nargs="+", default=DEFAULT_TYPES, choices=ALL_TYPES + ["all"],
                    help="문서 종류 ('all' = 13종 전체)")
    ap.add_argument("--locales", nargs="+", default=["en"], choices=["en", "fr"], help="남길 언어")
    ap.add_argument("--splits", nargs="+", default=ALL_SPLITS, choices=ALL_SPLITS, help="처리할 split")
    ap.add_argument("--no-scans", action="store_true", help="스캔 이미지 제외 (용량 약 1/3로 감소)")
    ap.add_argument("--revision", default=DEFAULT_REVISION, help="데이터셋 버전 (커밋 해시 또는 'main')")
    ap.add_argument("--workers", type=int, default=8, help="동시 다운로드 수")
    ap.add_argument("--skip-download", action="store_true", help="다운로드 생략 (원본이 이미 있을 때)")
    ap.add_argument("--skip-verify", action="store_true", help="마지막 검증 생략")
    ap.add_argument("--force", action="store_true", help="기존 정제 결과를 지우고 처음부터")
    ap.add_argument("--delete-raw", action="store_true", help="정제·검증 성공 후 원본 폴더 삭제")
    a = ap.parse_args(argv)
    if "all" in a.types:
        a.types = ALL_TYPES
    return a


def main(argv=None) -> int:
    a = parse_args(argv)
    SPLITS[:] = a.splits
    for stream in (sys.stdout, sys.stderr):  # Windows 콘솔 등에서 한글 로그가 깨지거나 죽지 않도록
        try:
            stream.reconfigure(errors="replace")
        except AttributeError:
            pass
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s", datefmt="%H:%M:%S")
    with_scans = not a.no_scans
    t0 = time.time()

    if not a.skip_download:
        download(a.raw, a.types, a.revision, with_scans, a.workers)
    summary = organize(a.raw, a.out, a.types, a.locales, with_scans, a.revision, a.force)
    log.info("정리 완료: 문서 %s건, 스캔 %s장 -> %s",
             f"{summary['total_documents']:,}", f"{summary['total_scan_pages']:,}", a.out)

    if not a.skip_verify and not verify(a.raw, a.out, summary):
        log.error("검증 실패: 위 FAIL 항목을 확인하세요. 원본은 삭제하지 않았습니다.")
        return 1
    if a.delete_raw:
        shutil.rmtree(a.raw)
        log.info("원본 삭제: %s", a.raw)
    log.info("전체 소요 %.0f초", time.time() - t0)
    return 0


if __name__ == "__main__":
    sys.exit(main())
