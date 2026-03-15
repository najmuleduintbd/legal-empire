#!/bin/bash
# Download gazette files that exceed GitHub's 100MB limit
# These are excluded from the git repo via .gitignore
# Run: bash download_gazette_large.sh

DIR="$(dirname "$0")/Calcutta_Gazette"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

echo "Downloading large gazette files (excluded from GitHub due to 100MB limit)..."
echo ""

# 1. Calcutta Gazette 13339 (~121 MB) - Comprehensive bound volume
echo "[1/8] Calcutta Gazette (comprehensive volume)..."
curl -L -o "$DIR/Calcutta_Gazette_13339.pdf" -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/dli.bengal.10689.13339/10689.13339.pdf"

# 2. Calcutta Gazette 1885 Jul-Dec (~162 MB)
# KEY: Bengal Tenancy Act (1885) gazette notifications with rules
echo "[2/8] Calcutta Gazette 1885 Jul-Dec (Bengal Tenancy Act)..."
curl -L -o "$DIR/Calcutta_Gazette_1885_Jul-Dec.pdf" -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/in.ernet.dli.2015.40344/2015.40344.The-Calcutta-Gazette-1885-July---December.pdf"

# 3. Calcutta Gazette 1886 Apr-May (~168 MB)
# Bengal Tenancy Rules implementation notifications
echo "[3/8] Calcutta Gazette 1886 Apr-May (Tenancy Rules implementation)..."
curl -L -o "$DIR/Calcutta_Gazette_1886_Apr-May.pdf" -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/in.ernet.dli.2015.40345/2015.40345.The-Calcutta-Gazette-1886-April---May.pdf"

# 4. Calcutta Gazette 1890 Jan-Jun (~155 MB)
echo "[4/8] Calcutta Gazette 1890 Jan-Jun..."
curl -L -o "$DIR/Calcutta_Gazette_1890_Jan-Jun.pdf" -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/in.ernet.dli.2015.40351/2015.40351.The-Calcutta-Gazette-1890-January---June.pdf"

# 5. Calcutta Gazette 1910 Apr-Jun (~250 MB)
echo "[5/8] Calcutta Gazette 1910 Apr-Jun..."
curl -L -o "$DIR/Calcutta_Gazette_1910_Apr-Jun.pdf" -A "$UA" --max-time 900 --retry 3 \
  "https://archive.org/download/in.ernet.dli.2015.45154/2015.45154.The-Calcutta-Gazette-1910-April---June.pdf"

# 6. Calcutta Gazette 1920 Apr-Jun (~108 MB)
echo "[6/8] Calcutta Gazette 1920 Apr-Jun..."
curl -L -o "$DIR/Calcutta_Gazette_1920_Apr-Jun.pdf" -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/dli.bengal.10689.14069/10689.14069.pdf"

# 7. Calcutta Gazette 1937 Jan-Feb (~104 MB)
# GoI Act 1935 implementation - provincial autonomy rules
echo "[7/8] Calcutta Gazette 1937 Jan-Feb (GoI Act 1935 rules)..."
curl -L -o "$DIR/Calcutta_Gazette_1937_Jan-Feb.pdf" -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/in.ernet.dli.2015.55659/2015.55659.The-Calcutta-Gazette-1937-January---February.pdf"

# 8. Gazette of India Main Volume (~433 MB)
GDIR="$(dirname "$0")/Gazette_of_India"
echo "[8/8] Gazette of India Main Volume (18686)..."
curl -L -o "$GDIR/Gazette_India_Main_18686.pdf" -A "$UA" --max-time 900 --retry 3 \
  "https://archive.org/download/dli.bengal.10689.18686/10689.18686.pdf"

echo ""
echo "Done! Verifying..."
for f in "$DIR/Calcutta_Gazette_13339.pdf" \
         "$DIR/Calcutta_Gazette_1885_Jul-Dec.pdf" \
         "$DIR/Calcutta_Gazette_1886_Apr-May.pdf" \
         "$DIR/Calcutta_Gazette_1890_Jan-Jun.pdf" \
         "$DIR/Calcutta_Gazette_1910_Apr-Jun.pdf" \
         "$DIR/Calcutta_Gazette_1920_Apr-Jun.pdf" \
         "$DIR/Calcutta_Gazette_1937_Jan-Feb.pdf" \
         "$GDIR/Gazette_India_Main_18686.pdf"; do
  if [ -f "$f" ]; then
    sz=$(wc -c < "$f")
    echo "  $(basename "$f"): $((sz/1048576)) MB"
  else
    echo "  MISSING: $(basename "$f")"
  fi
done
