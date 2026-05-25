# Google Sign-In (Vallejera mobile)

Uses **native Google Sign-In** and `POST /api/login/google` on srusystem.

**Setup checklist (start here):** [GOOGLE_SIGNIN_CHECKLIST.md](../GOOGLE_SIGNIN_CHECKLIST.md)

- Web client ID: `src/app/api/google.config.ts` (same as `GOOGLE_CLIENT_ID` in srusystem)
- Android client: [shoesrus](https://console.cloud.google.com/auth/clients?project=shoesrus) — see `android/GOOGLE_SIGNIN_SETUP.md`
- Backend: `http://10.0.2.2:8000` on emulator

## Flow

1. Tap **Continue with Google** → in-app account picker.
2. App sends Google `idToken` to `POST /api/login/google`.
3. Symfony returns JWT → same as email/password login.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `DEVELOPER_ERROR` | Add Android OAuth client + correct SHA-1 in Google Cloud. |
| No idToken | `GOOGLE_WEB_CLIENT_ID` must be the **Web** client ID. |
| Stuck loading | Reload app; ensure backend is up and account is verified. |

Optional browser OAuth (JWT bridge): add `?platform=app` to `/login/google` on the server — not used by the app UI today.
