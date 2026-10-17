#!/usr/bin/env bash
# Renders the Leoz owner report from audit/report-src/ into audit/reports/ as a PDF.
# Run: bash audit/report-src/render.sh
set -e
SRC="$HOME/Desktop/leoz-apps/audit/report-src"
OUT="$HOME/Desktop/leoz-apps/audit/reports"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p "$OUT"
PROF="$(mktemp -d)"
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --user-data-dir="$PROF" --virtual-time-budget=6000 \
  --print-to-pdf="$OUT/Leoz-Gents-Salon-Website-Review.pdf" \
  "file://$SRC/owner.html" >/dev/null 2>&1 || true
if [ -s "$OUT/Leoz-Gents-Salon-Website-Review.pdf" ]; then
  echo "wrote $OUT/Leoz-Gents-Salon-Website-Review.pdf ($(wc -c < "$OUT/Leoz-Gents-Salon-Website-Review.pdf" | tr -d ' ') bytes)"
else
  echo "FAILED to render"
fi
