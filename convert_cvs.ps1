$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

$srcDir = 'C:\Repo\Legal Empire\cvs'
$outDir = 'C:\Repo\Legal Empire\cvs\pdf'

$mapping = @{
    'Academic CV.doc' = 'Academic_CV.pdf'
    'CV for World Bank.docx' = 'CV_Dr_Shahidul_Islam_World_Bank.pdf'
    'CV of Ayesha(Revised).docx' = 'CV_Ayesha_Saleh.pdf'
    'CV of H. Farhad.docx' = 'CV_Humayun_Farhad.pdf'
    'CV of Md Golam Mostofa Hasan (1) (2).docx' = 'CV_Md_Golam_Mostofa_Hasan.pdf'
    'CV of S.N.Khan 21.09.17 (1).docx' = 'CV_Sultana_Nasira_Khan.pdf'
    'CV of Shuvra Chowdhury Professional.doc' = 'CV_Shuvra_Chowdhury.pdf'
    'Dr. Zahangir Alam  Khan. Secretary (Rtd.)-1.docx' = 'CV_Dr_Zahangir_Alam_Khan.pdf'
    'Resume of MD Saiful Alam nov 2024.docx' = 'CV_Md_Saiful_Alam.pdf'
}

foreach ($entry in $mapping.GetEnumerator()) {
    $srcPath = Join-Path $srcDir $entry.Key
    $outPath = Join-Path $outDir $entry.Value
    if (Test-Path $srcPath) {
        Write-Host "Converting: $($entry.Key)"
        try {
            $doc = $word.Documents.Open($srcPath, $false, $true)
            $doc.SaveAs2($outPath, 17)
            $doc.Close($false)
            Write-Host "  OK -> $($entry.Value)"
        } catch {
            Write-Host "  FAILED: $($_.Exception.Message)"
        }
    } else {
        Write-Host "  NOT FOUND: $($entry.Key)"
    }
}

$word.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Host "`nAll conversions complete."
