# Google Sign-In — finish setup (Vallejera + srusystem)

## `DEVELOPER_ERROR` on the phone?

Google does not see a matching **Android** OAuth client for this APK. Fix in Console (not in code):

1. Open **[shoesrus → Clients](https://console.cloud.google.com/auth/clients?project=shoesrus)** (not `device-streaming-cbff08b3`).
2. **Create client** → **Android** (if you only created one in another project, it will not work).
3. Use **exactly**:

| Field | Value |
|-------|--------|
| Package name | `com.vallejera` |
| SHA-1 | `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25` |

4. Wait 2–5 minutes, then `npx react-native run-android` and try again.

Common mistakes: package `com.Vallejera` (wrong case), Android client in a different GCP project than the Web client ID, or only a Web client and no Android client.

---

Use **one** Google Cloud project only: **`shoesrus`**.

Your **Android** client in shoesrus starts with **`45503149806-`** — that number is the **shoesrus** project number. Good.

The old Web ID in the app (`96873446794-...`) is from a **different** Google Cloud project. You will not see it on the shoesrus Clients list. Create a **new Web application** client **inside shoesrus** (it will also start with `45503149806-`).

---

## Already done in shoesrus

| Client | Status |
|--------|--------|
| **Android** `com.vallejera` + SHA-1 | Done (Vallejera) |
| **Web application** | **Create this next** (see below) |

---

## Web client (configured)

| Location | Value |
|----------|--------|
| Vallejera `src/app/api/google.config.ts` | `45503149806-ifpg1i4seucssiiu7v36kpr7hdplschn...` |
| srusystem `.env` | Same `GOOGLE_CLIENT_ID` + secret |

---

## You do this once in Google Cloud

### 1. Open the correct project

[Google Auth Platform — shoesrus](https://console.cloud.google.com/auth/overview?project=shoesrus)

Top bar must show project **shoesrus**, not `device-streaming-cbff08b3`.

### 2. OAuth consent (if not done)

- **Audience** → User type **External**
- If status is **Testing** → **Test users** → add the Gmail you sign in with

### 3. Web client (should already exist)

**Clients** → type **Web application** → Client ID must be:

`96873446794-kgfgkra6ck9u632bq2co350rcuokgmkt.apps.googleusercontent.com`

If missing, create **Web application** and update **both** `google.config.ts` and srusystem `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`.

### 4. Android client (required for the app)

**Clients** → **Create client** → **Android**

| Field | Value |
|-------|--------|
| Package name | `com.vallejera` |
| SHA-1 | `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25` |

Package name is **case-sensitive** — use lowercase `com.vallejera`.

Verify SHA-1 (PowerShell, from repo root):

```powershell
keytool -list -v -keystore "android\app\debug.keystore" -alias androiddebugkey -storepass android -keypass android
```

---

## Run locally

**Terminal 1 — backend** (srusystem folder):

```powershell
cd C:\Users\valle\srusystem
docker compose up -d
php -S 0.0.0.0:8000 -t public
```

**Terminal 2 — app** (Vallejera folder):

```powershell
cd "c:\2ND SEM - 3RD YR\Vallejera"
npx react-native run-android
```

Emulator API URL is already `http://10.0.2.2:8000` in `src/app/api/config.ts`.

---

## Test

1. Open app → **Continue with Google**
2. Pick the Gmail you added as a **test user**
3. You should land logged in (JWT from `POST /api/login/google`)

---

## If it fails

| Error | Fix |
|-------|-----|
| `DEVELOPER_ERROR` | Android client in **shoesrus**, package `com.vallejera`, SHA-1 correct |
| `Access blocked` / 403 | Add your Gmail under **Audience** → test users |
| API / invalid token | `GOOGLE_CLIENT_ID` in srusystem must match `GOOGLE_WEB_CLIENT_ID` in the app |
| Network error | Backend running on port 8000; emulator uses `10.0.2.2` |

---

## Optional: new Google Cloud project

Only if you abandon **shoesrus**:

1. Create Web + Android clients in the **new** project
2. Update Vallejera `src/app/api/google.config.ts` → Web client ID
3. Update srusystem `.env` → `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` from that Web client
4. Restart PHP server and rebuild the app
