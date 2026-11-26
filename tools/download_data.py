"""TradePilot 평가셋을 구글 드라이브에서 내려받아 data/eval/ 에 풀어 줍니다.

사용법 (저장소 최상위 폴더에서, 추가 패키지 필요 없음):
    python tools/download_data.py

결과:
    data/eval/tradepilot_eval_v1/
        README.md, manifest.json
        invoice/<doc_id>/{scan.jpg, pdf.png, pdf_text.txt, gold.json}
        purchase_order/<doc_id>/...
"""
from __future__ import annotations

import argparse
import hashlib
import shutil
import sys
import urllib.request
import zipfile
from pathlib import Path

# 구글 드라이브 공유 파일 (https://drive.google.com/file/d/<FILE_ID>/view)
GDRIVE_FILE_ID = "17U4-fg56SS-VxMyj3UlgWIHuBW7FSad3"
DOWNLOAD_URL = f"https://drive.usercontent.google.com/download?id={GDRIVE_FILE_ID}&export=download&confirm=t"
ZIP_NAME = "tradepilot_eval_v1.zip"
SHA256 = "8880e237179faa620f8f94c688bb934b10a451f282a081fc382bd3fde46b41fa"

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUT = ROOT / "data" / "eval"


def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def download(dest: Path) -> None:
    print(f"내려받는 중: {DOWNLOAD_URL}")
    tmp = dest.with_suffix(".part")
    try:
        req = urllib.request.Request(DOWNLOAD_URL, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r, tmp.open("wb") as f:
            total = int(r.headers.get("Content-Length") or 0)
            done = 0
            while chunk := r.read(1 << 20):
                f.write(chunk)
                done += len(chunk)
                if total:
                    print(f"\r  {done / 1e6:6.1f} / {total / 1e6:.1f} MB", end="", flush=True)
        print()
        tmp.replace(dest)
    except Exception as e:  # noqa: BLE001
        tmp.unlink(missing_ok=True)
        sys.exit(f"내려받기 실패: {e}\n브라우저로 직접 받은 뒤 --zip 옵션으로 지정하세요:\n"
                 f"  https://drive.google.com/file/d/{GDRIVE_FILE_ID}/view")


def main() -> None:
    ap = argparse.ArgumentParser(description="TradePilot 평가셋 내려받기")
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT, help="압축을 풀 폴더 (기본: data/eval)")
    ap.add_argument("--zip", type=Path, help="이미 받은 zip 파일 경로 (내려받기 생략)")
    ap.add_argument("--keep-zip", action="store_true", help="압축을 푼 뒤 zip 파일을 남김")
    ap.add_argument("--force", action="store_true", help="이미 풀린 평가셋이 있어도 다시 풂")
    args = ap.parse_args()

    target = args.out / "tradepilot_eval_v1"
    if target.exists() and not args.force:
        print(f"이미 있습니다: {target}  (다시 받으려면 --force)")
        return

    args.out.mkdir(parents=True, exist_ok=True)
    zip_path = args.zip or (args.out / ZIP_NAME)
    if args.zip is None and not zip_path.exists():
        download(zip_path)

    print("파일 검증 중 (SHA-256)...")
    digest = sha256_of(zip_path)
    if digest != SHA256:
        sys.exit(f"검증 실패: 파일이 손상되었거나 다른 버전입니다.\n  기대값 {SHA256}\n  실제값 {digest}")

    if target.exists():
        shutil.rmtree(target)
    with zipfile.ZipFile(zip_path) as z:
        z.extractall(args.out)
    print(f"완료: {target}")

    if args.zip is None and not args.keep_zip:
        zip_path.unlink()


if __name__ == "__main__":
    main()
