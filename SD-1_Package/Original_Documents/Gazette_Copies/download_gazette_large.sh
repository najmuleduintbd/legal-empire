#!/bin/bash
# Download gazette files that exceed GitHub's 100MB limit
# These are excluded from the git repo via .gitignore
# Run: bash download_gazette_large.sh

DIR="$(dirname "$0")/Calcutta_Gazette"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

echo "Downloading large gazette files (excluded from GitHub due to 100MB limit)..."

# 1. Calcutta Gazette 13339 (~121 MB)
echo "[1/4] Calcutta Gazette (dli.bengal.10689.13339)..."
curl -L -o "$DIR/Calcutta_Gazette_13339.pdf" -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/dli.bengal.10689.13339/10689.13339.pdf"

# 2. Calcutta Gazette 1885 Jul-Dec (~162 MB) — KEY: Bengal Tenancy Act gazette notifications
echo "[2/4] Calcutta Gazette 1885 Jul-Dec (Bengal Tenancy Act notifications)..."
curl -L -o "$DIR/Calcutta_Gazette_1885_Jul-Dec.pdf" -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/in.ernet.dli.2015.40344/2015.40344.The-Calcutta-Gazette-1885-July---December.pdf"

# 3. Calcutta Gazette 1890 Jan-Jun (~155 MB)
echo "[3/4] Calcutta Gazette 1890 Jan-Jun..."
curl -L -o "$DIR/Calcutta_Gazette_1890_Jan-Jun.pdf" -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/in.ernet.dli.2015.40351/2015.40351.The-Calcutta-Gazette-1890-January---June.pdf"

# 4. Calcutta Gazette 1920 Apr-Jun (~108 MB)
echo "[4/4] Calcutta Gazette 1920 Apr-Jun..."
curl -L -o "$DIR/Calcutta_Gazette_1920_Apr-Jun.pdf" -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/dli.bengal.10689.14069/10689.14069.pdf"

echo ""
echo "Done! Verifying..."
for f in "$DIR/Calcutta_Gazette_13339.pdf" \
         "$DIR/Calcutta_Gazette_1885_Jul-Dec.pdf" \
         "$DIR/Calcutta_Gazette_1890_Jan-Jun.pdf" \
         "$DIR/Calcutta_Gazette_1920_Apr-Jun.pdf"; do
  if [ -f "$f" ]; then
    sz=$(wc -c < "$f")
    echo "  $(basename "$f"): $((sz/1048576)) MB"
  else
    echo "  MISSING: $(basename "$f")"
  fi
done
