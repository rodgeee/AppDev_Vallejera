$ErrorActionPreference = "Stop"
$keystore = Join-Path $PSScriptRoot "..\app\vallejera-release.keystore"
if (-not (Test-Path $keystore)) {
    Write-Error "Missing $keystore — run generate-release-keystore.ps1 first."
}
keytool -list -v -keystore $keystore -alias vallejera -storepass VallejeraRelease2026 -keypass VallejeraRelease2026 |
    Select-String -Pattern "SHA1:|Owner:|Issuer:"
