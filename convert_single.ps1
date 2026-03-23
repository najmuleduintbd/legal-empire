param([string]$src, [string]$out)
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $doc = $word.Documents.Open($src, $false, $true)
    $doc.SaveAs2($out, 17)
    $doc.Close($false)
    Write-Host "OK"
} catch {
    Write-Host "FAILED: $($_.Exception.Message)"
}
$word.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
