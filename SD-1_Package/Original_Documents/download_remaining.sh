#!/bin/bash
# Download remaining subordinate legislation documents from archive.org
# These files are large and may timeout - run with a good connection
# Usage: bash download_remaining.sh

OUTDIR="$(dirname "$0")"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

echo "Downloading remaining subordinate legislation documents..."
echo "Target directory: $OUTDIR"
echo ""

# ============================================================
# ERA 1 — BENGAL REGULATIONS (1790-1858)
# ============================================================

# 1. Fort William Regulations 1853 Vol 1 (Clarke's compilation) — 96 MB
echo "[1/12] Fort William Regulations 1853 (Clarke's)..."
mkdir -p "$OUTDIR/1854"
curl -L -o "$OUTDIR/1854/Fort_William_Regulations_1853.pdf" \
  -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/wbsl.20031/20031_text.pdf"

# 2. Fort William Rules & Ordinances 1826 — 9 MB
echo "[2/12] Fort William Rules & Ordinances 1826..."
mkdir -p "$OUTDIR/1826"
curl -L -o "$OUTDIR/1826/Fort_William_Rules_Ordinances_1826.pdf" \
  -A "$UA" --max-time 300 --retry 3 \
  "https://archive.org/download/dli.bengal.10689.19209/10689.19209_text.pdf"

# 3. Bengal Police Manual 1888, 2nd Ed — 28 MB
echo "[3/12] Bengal Police Manual 1888..."
mkdir -p "$OUTDIR/1888"
curl -L -o "$OUTDIR/1888/Bengal_Police_Manual_1888.pdf" \
  -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/in.ernet.dli.2015.356149/2015.356149.Bengal-Police_text.pdf"

# 4. Circular Orders - High Court Fort William 1862-1876 — 16 MB
echo "[4/12] Bengal High Court Circular Orders 1862-1876..."
mkdir -p "$OUTDIR/1876"
curl -L -o "$OUTDIR/1876/Bengal_High_Court_Circular_Orders_1862-1876.pdf" \
  -A "$UA" --max-time 300 --retry 3 \
  "https://archive.org/download/wbsl.17844/17844_text.pdf"

# ============================================================
# ERA 2 — BRITISH INDIA (1858-1947)
# ============================================================

# 5. Bengal Criminal Court Manual 1883 — est 20 MB
echo "[5/12] Bengal Criminal Court Manual 1883..."
mkdir -p "$OUTDIR/1883"
curl -L -o "$OUTDIR/1883/Bengal_Criminal_Court_Manual_1883.pdf" \
  -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/dli.ministry.17826/dli.ministry.17826.pdf"

# 6. Bengal Police Manual 1911 Vol 1 — 29 MB
echo "[6/12] Bengal Police Manual 1911 Vol 1..."
mkdir -p "$OUTDIR/1911"
curl -L -o "$OUTDIR/1911/Bengal_Police_Manual_1911_Vol1.pdf" \
  -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/bengalpolicemanu01gove/bengalpolicemanu01gove.pdf"

# 7. Putni Sale Law with Board of Revenue Rules 1907 — 15 MB
echo "[7/12] Bengal Putni Sale Law with Revenue Rules 1907..."
mkdir -p "$OUTDIR/1907"
curl -L -o "$OUTDIR/1907/Bengal_Putni_Sale_Law_Revenue_Rules_1907.pdf" \
  -A "$UA" --max-time 300 --retry 3 \
  "https://archive.org/download/putnisalelawofbe00ghosrich/putnisalelawofbe00ghosrich.pdf"

# 8. Police Regulations Bengal 1943 Vol 1 — est 40 MB
echo "[8/12] Police Regulations Bengal 1943 Vol 1..."
mkdir -p "$OUTDIR/1943"
curl -L -o "$OUTDIR/1943/Police_Regulations_Bengal_1943_Vol1.pdf" \
  -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/in.ernet.dli.2015.45676/2015.45676.Police-Regulations-Bengal-1943--Vol1.pdf"

# 9. Civil Rules and Orders 1935 Vol 2
echo "[9/12] Civil Rules and Orders 1935 Vol 2..."
mkdir -p "$OUTDIR/1935"
curl -L -o "$OUTDIR/1935/Civil_Rules_Orders_1935_Vol2.pdf" \
  -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/in.ernet.dli.2015.48161/2015.48161.Civil-Rules-And-Orders-1935-Vol-2_text.pdf"

# 10. Indian Arms Act Manual (with Arms Rules 1924)
echo "[10/12] Indian Arms Act Manual..."
mkdir -p "$OUTDIR/1931"
curl -L -o "$OUTDIR/1931/Indian_Arms_Act_Manual_1931.pdf" \
  -A "$UA" --max-time 300 --retry 3 \
  "https://archive.org/download/in.ernet.dli.2015.97369/2015.97369.The-Indian-Arms-Act-Manual.pdf"

# 11. Bengal Local Statutory Rules Vol 1
echo "[11/12] Bengal Local Statutory Rules 1912 Vol 1..."
mkdir -p "$OUTDIR/1912"
curl -L -o "$OUTDIR/1912/Bengal_Local_Statutory_Rules_Orders_1912_Vol1.pdf" \
  -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/in.ernet.dli.2015.13407/2015.13407.The-Bengal-Local-Statutory-Rules-And-Orders1912-vol-ist.pdf"

# 12. Bengal Practice and Procedure Manual 1940
echo "[12/12] Bengal Practice and Procedure Manual 1940..."
mkdir -p "$OUTDIR/1940"
curl -L -o "$OUTDIR/1940/Bengal_Practice_Procedure_Manual_1940.pdf" \
  -A "$UA" --max-time 600 --retry 3 \
  "https://archive.org/download/in.ernet.dli.2015.282014/2015.282014.The-Bengal.pdf"

echo ""
echo "Done! Checking results..."
echo ""

# Verify downloads
for f in "$OUTDIR"/1854/Fort_William_Regulations_1853.pdf \
         "$OUTDIR"/1826/Fort_William_Rules_Ordinances_1826.pdf \
         "$OUTDIR"/1888/Bengal_Police_Manual_1888.pdf \
         "$OUTDIR"/1876/Bengal_High_Court_Circular_Orders_1862-1876.pdf \
         "$OUTDIR"/1883/Bengal_Criminal_Court_Manual_1883.pdf \
         "$OUTDIR"/1911/Bengal_Police_Manual_1911_Vol1.pdf \
         "$OUTDIR"/1907/Bengal_Putni_Sale_Law_Revenue_Rules_1907.pdf \
         "$OUTDIR"/1943/Police_Regulations_Bengal_1943_Vol1.pdf \
         "$OUTDIR"/1935/Civil_Rules_Orders_1935_Vol2.pdf \
         "$OUTDIR"/1931/Indian_Arms_Act_Manual_1931.pdf \
         "$OUTDIR"/1912/Bengal_Local_Statutory_Rules_Orders_1912_Vol1.pdf \
         "$OUTDIR"/1940/Bengal_Practice_Procedure_Manual_1940.pdf; do
  if [ -f "$f" ]; then
    sz=$(stat -c%s "$f" 2>/dev/null || wc -c < "$f")
    if [ "$sz" -gt 5000 ]; then
      echo "  OK: $(basename "$f") = $((sz/1024)) KB"
    else
      echo "  FAILED (too small): $(basename "$f")"
    fi
  else
    echo "  MISSING: $(basename "$f")"
  fi
done
