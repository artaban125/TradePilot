"""TradePilot 평가셋을 구글 드라이브에서 내려받아 data/eval/ 에 풀어 줍니다.

사용법 (저장소 최상위 폴더에서):
    pip install gdown
    python tools/download_data.py

결과:
    data/eval/tradepilot_eval_v1/
        manifest.json
        invoice/<doc_id>/{scan.jpg, pdf.png, pdf_text.txt, gold.json}
        purchase_order/<doc_id>/...
"""
from __future__ import annotations

import argparse
import hashlib
import sys
import zipfile
from pathlib import Path

# 구글 드라이브 공유 링크의 파일 ID (https://drive.google.com/file/d/<FILE_ID>/view)
GDRIVE_FILE_ID = "__FILE_ID__"
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
    if GDRIVE_FILE_ID.startswith("__"):
        sys.exit("구글 드라이브 링크를 준비 중입니다. 파일을 직접 받았다면 --zip 옵션으로 지정하세요.")
    try:
        import gdown
    except ImportError:
        sys.exit("gdown 이 필요합니다: pip install gdown")
    url = f"https://drive.google.com/uc?id={GDRIVE_FILE_ID}"
    print(f"내려받는 중: {url}")
    if gdown.download(url, str(dest), quiet=False) is None:
        sys.exit("내려받기에 실패했습니다. 브라우저로 직접 받아 --zip 옵션으로 지정하세요.")


def main() -> None:
    ap = argparse.ArgumentParser(description="TradePilot 평가셋 내려받기")
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT, help="압축을 풀 폴더 (기본: data/eval)")
    ap.add_argument("--zip", type=Path, help="이미 받은 zip 파일 경로 (내려받기 생략)")
    ap.add_argument("--keep-zip", action="store_true", help="압축을 푼 뒤 zip 파일을 남김")
    args = ap.parse_args()

    args.out.mkdir(parents=True, exist_ok=True)
    zip_path = args.zip or (args.out / ZIP_NAME)

    if args.zip is None and not zip_path.exists():
        download(zip_path)

    print("파일 검증 중 (SHA-256)...")
    digest = sha256_of(zip_path)
    if digest != SHA256:
        sys.exit(f"검증 실패: 파일이 손상되었거나 다른 버전입니다.\n  기대값 {SHA256}\n  실제값 {digest}")

    with zipfile.ZipFile(zip_path) as z:
        z.extractall(args.out)
    print(f"완료: {args.out / 'tradepilot_eval_v1'}")

    if args.zip is None and not args.keep_zip:
        zip_path.unlink()


if __name__ == "__main__":
    main()
