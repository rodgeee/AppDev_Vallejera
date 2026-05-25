# Print debug SHA-1 for Google Cloud Android OAuth client
$keystore = Join-Path $PSScriptRoot "..\app\debug.keystore"
keytool -list -v -keystore $keystore -alias androiddebugkey -storepass android -keypass android |
  Select-String -Pattern "SHA1:"
