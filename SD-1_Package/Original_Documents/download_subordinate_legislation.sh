#!/bin/bash
# Download script for Subordinate Legislation PDFs under British India Acts (1858-1900)
# Run this script from the Original_Documents directory or it will use absolute paths.

BASE="C:/Repo/Legal Empire/SD-1_Package/Original_Documents"

download_if_missing() {
    local dest="$1"
    local url="$2"
    if [ -f "$dest" ]; then
        echo "SKIP (exists): $dest"
    else
        echo "Downloading: $dest"
        curl -L -o "$dest" "$url" --max-time 300 -s -w "  -> HTTP %{http_code}, %{size_download} bytes\n"
        if [ $? -ne 0 ]; then
            echo "  -> FAILED: $dest"
            rm -f "$dest"
        fi
    fi
}

echo "============================================================"
echo "1. POLICE REGULATIONS OF BENGAL 1943 (PRB) - 3 Volumes"
echo "============================================================"
download_if_missing "$BASE/1943/Police_Regulations_Bengal_1943_Vol1.pdf" \
    "https://archive.org/download/in.ernet.dli.2015.45676/2015.45676.Police-Regulations-Bengal-1943--Vol1.pdf"

download_if_missing "$BASE/1943/Police_Regulations_Bengal_1943_Vol2.pdf" \
    "https://archive.org/download/in.ernet.dli.2015.45677/2015.45677.Police-Regulations-Bengal-1943--Vol2.pdf"

download_if_missing "$BASE/1943/Police_Regulations_Bengal_1943_Vol3.pdf" \
    "https://archive.org/download/in.ernet.dli.2015.45678/2015.45678.Police-Regulations-Bengal-1943--Vol3.pdf"

echo ""
echo "============================================================"
echo "2. BENGAL CRIMINAL RULES AND ORDERS (under CrPC 1898)"
echo "   -> New Criminal Court Manual (Cranenburgh, 1883)"
echo "   -> Bengal Practice and Procedure Manual 1940"
echo "============================================================"
download_if_missing "$BASE/1883/New_Criminal_Court_Manual_Bengal_1883.pdf" \
    "https://archive.org/download/dli.ministry.17826/E02740_The_New_Criminal_Court_Manual.pdf"

download_if_missing "$BASE/1940/Bengal_Practice_Procedure_Manual_1940.pdf" \
    "https://archive.org/download/in.ernet.dli.2015.282014/2015.282014.The-Bengal.pdf"

echo ""
echo "============================================================"
echo "3. BENGAL/INDIAN ARMS RULES 1924"
echo "   -> Indian Arms Act Manual (7th Ed, 1928 - contains 1924 Rules)"
echo "   -> Indian Arms Act Manual (8th Ed, 1931 - contains 1924 Rules)"
echo "============================================================"
download_if_missing "$BASE/1928/Indian_Arms_Act_Manual_1928.pdf" \
    "https://archive.org/download/in.ernet.dli.2015.72322/2015.72322.The-Indian-Arms-Act-Manual-Containing-Seventh-Edition-Septembar-1928.pdf"

download_if_missing "$BASE/1931/Indian_Arms_Act_Manual_1931.pdf" \
    "https://archive.org/download/in.ernet.dli.2015.97369/2015.97369.The-Indian-Arms-Act-Manual.pdf"

echo ""
echo "============================================================"
echo "4. BENGAL TENANCY RULES (under Bengal Tenancy Act 1885)"
echo "   -> Bengal Tenancy Act with Rules (Rampini, 1889)"
echo "============================================================"
download_if_missing "$BASE/1885/Bengal_Tenancy_Act_Rules_1885.pdf" \
    "https://archive.org/download/bengaltenancyact00rampuoft/bengaltenancyact00rampuoft.pdf"

echo ""
echo "============================================================"
echo "5. BENGAL SURVEY AND SETTLEMENT MANUAL 1935"
echo "============================================================"
download_if_missing "$BASE/1935/Bengal_Survey_Settlement_Manual_1935.pdf" \
    "https://archive.org/download/in.ernet.dli.2015.38960/2015.38960.The-Bengal-Survey-And-Settlement-Manual-1935.pdf"

echo ""
echo "============================================================"
echo "6. INDIAN TREASURE TROVE RULES"
echo "   -> Manual of Government Orders UP (contains Treasure Trove Act rules)"
echo "============================================================"
download_if_missing "$BASE/1878/Manual_Government_Orders_Treasure_Trove_Rules.pdf" \
    "https://archive.org/download/in.ernet.dli.2015.17201/2015.17201.Manual-Of-Government-Orders-Uttar-Pradesh.pdf"

echo ""
echo "============================================================"
echo "7. LAND ACQUISITION RULES / BENGAL LAND ACQUISITION MANUAL"
echo "   -> Land Acquisition Act 1894 (Beverley) with Rules"
echo "============================================================"
download_if_missing "$BASE/1894/Land_Acquisition_Act_1894_Bengal.pdf" \
    "https://archive.org/download/dli.csl.8838/8838.pdf"

echo ""
echo "============================================================"
echo "8. BENGAL STAMP RULES (under Indian Stamp Act 1899)"
echo "   -> Indian Stamp Act 1899 (4th Ed, Basu) with Rules"
echo "   -> Bengal Local Statutory Rules and Orders 1912 (contains Stamp Rules)"
echo "============================================================"
download_if_missing "$BASE/1899/Indian_Stamp_Act_1899_with_Rules.pdf" \
    "https://archive.org/download/in.ernet.dli.2015.72309/2015.72309.The-Indian-Stamp-Act-Edition-Fourth-1899.pdf"

download_if_missing "$BASE/1912/Bengal_Local_Statutory_Rules_Orders_1912.pdf" \
    "https://archive.org/download/in.ernet.dli.2015.13407/2015.13407.The-Bengal-Local-Statutory-Rules-And-Orders1912-vol-ist.pdf"

echo ""
echo "============================================================"
echo "9. INDIAN TELEGRAPH RULES"
echo "   -> Indian Telegraph Act 1885 and Post Office Act 1898"
echo "============================================================"
download_if_missing "$BASE/1885/Indian_Telegraph_Act_1885_Rules.pdf" \
    "https://archive.org/download/eparlib.nic.in.5696/11_V_31071997_p127_p127_t251.pdf"

echo ""
echo "============================================================"
echo "10. GUARDIANS AND WARDS RULES"
echo "    -> Unrepealed Central Acts Vol III (1882-1897) contains G&W Act 1890"
echo "============================================================"
download_if_missing "$BASE/1897/Unrepealed_Central_Acts_Vol3_1882_1897.pdf" \
    "https://archive.org/download/in.ernet.dli.2015.83361/2015.83361.The-Unrepealed-Central-Acts-With-Chronological-Table-And-Index-Volume-Iii-From-1882-To-1897-Both-Inclusive.pdf"

echo ""
echo "============================================================"
echo "11. EPIDEMIC DISEASES REGULATIONS (BENGAL)"
echo "    -> The Plague in India Vol I 1896-1897 (contains Bengal regulations)"
echo "    -> The Plague in India Appendices VII-XII 1896-1897"
echo "============================================================"
download_if_missing "$BASE/1897/Plague_India_Vol1_1896_1897_Epidemic_Regulations.pdf" \
    "https://archive.org/download/in.ernet.dli.2015.72332/2015.72332.The-Plague-In-India-Vol-I-1896-1897.pdf"

download_if_missing "$BASE/1897/Plague_India_Appendices_1896_1897.pdf" \
    "https://archive.org/download/in.ernet.dli.2015.72349/2015.72349.The-Plague-In-India-Appendices-Vii-To-Xii-1896-1897.pdf"

# Alternative source for Epidemic Diseases - Plague in India (Wellcome Library copy)
download_if_missing "$BASE/1897/Plague_India_1896_1897_Nathan.pdf" \
    "https://archive.org/download/b2497528x_0001/b2497528x_0001.pdf"

echo ""
echo "============================================================"
echo "12. GENERAL CLAUSES ACT INTERPRETIVE ORDERS"
echo "    -> The General Clauses Act 1897 (Ilbert)"
echo "============================================================"
download_if_missing "$BASE/1897/General_Clauses_Act_1897.pdf" \
    "https://archive.org/download/in.ernet.dli.2015.548598/2015.548598.The-General.pdf"

echo ""
echo "============================================================"
echo "DOWNLOAD COMPLETE - Summary"
echo "============================================================"
echo ""
echo "Files by year folder:"
for year in 1878 1883 1885 1894 1897 1899 1912 1928 1931 1935 1940 1943; do
    count=$(ls -1 "$BASE/$year/"*.pdf 2>/dev/null | wc -l)
    echo "  $year/: $count PDF file(s)"
done
echo ""
echo "Total PDFs downloaded:"
find "$BASE" -name "*.pdf" -newer "$0" 2>/dev/null | wc -l
