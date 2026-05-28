# Creates android/app/vallejera-release.keystore (CN + O for APK Analyzer).
# Re-run only if you intentionally need a new signing key (updates Play SHA-1).
$ErrorActionPreference = "Stop"
$appDir = Join-Path $PSScriptRoot "..\app"
$keystore = Join-Path $appDir "vallejera-release.keystore"

if (Test-Path $keystore) {
    Write-Host "Keystore already exists: $keystore"
    exit 0
}

$dname = "CN=Rodge Gionne J. Vallejera, O=APPDEVSUBJECT, OU=Mobile, L=Philippines, C=PH"
$storePass = "VallejeraRelease2026"
$keyPass = "VallejeraRelease2026"

keytool -genkeypair -v `
    -keystore $keystore `
    -alias vallejera `
    -keyalg RSA `
    -keysize 2048 `
    -validity 10000 `
    -storepass $storePass `
    -keypass $keyPass `
    -dname $dname

Write-Host "Created $keystore"
Write-Host "Ensure android/keystore.properties matches storePassword and keyPassword."
