# Android OAuth client (shoesrus project)

Full checklist: **[GOOGLE_SIGNIN_CHECKLIST.md](../GOOGLE_SIGNIN_CHECKLIST.md)** at repo root.

## Quick steps

1. Project: **[shoesrus](https://console.cloud.google.com/auth/clients?project=shoesrus)** (not `device-streaming-cbff08b3`)
2. **Clients** → **Create client** → **Android**
3. Package: `com.vallejera` | SHA-1: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
4. **Audience** → add your Gmail as test user (if app is in Testing)
5. Rebuild: `npx react-native run-android`

Web client ID is in `src/app/api/google.config.ts` (same as srusystem `GOOGLE_CLIENT_ID`).

Debug keystore: `android/app/debug.keystore`
