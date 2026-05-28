# Confirms release keystore issuer CN matches APK Analyzer expectations.
$ErrorActionPreference = "Stop"
$expectedCn = "Rodge Gionne J. Vallejera"
$expectedOrg = "APPDEVSUBJECT"
$keystore = Join-Path $PSScriptRoot "..\app\vallejera-release.keystore"

if (-not (Test-Path $keystore)) {
    Write-Error "Missing keystore. Run: android\scripts\generate-release-keystore.ps1"
}

$out = keytool -list -v -keystore $keystore -alias vallejera -storepass VallejeraRelease2026 2>&1 | Out-String
$issuerLine = ($out -split "`n" | Where-Object { $_ -match "^\s*Issuer:" }) -join ""

if ($issuerLine -notmatch "CN=$([regex]::Escape($expectedCn))") {
    Write-Error "Issuer CN mismatch. Got: $issuerLine"
}
if ($issuerLine -notmatch "O=$expectedOrg") {
    Write-Error "Issuer organization mismatch. Got: $issuerLine"
}

Write-Host "OK - Issuer name CN: $expectedCn"
Write-Host "OK - Issuer organization O: $expectedOrg"
Write-Host $issuerLine.Trim()
