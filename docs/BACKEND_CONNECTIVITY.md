# Fix "Network request failed" (phone and PC on same Wi‑Fi)

The app uses **http://192.168.5.111:8000**. If the phone still can't connect, check the following.

## 1. Backend must listen on all interfaces (not only localhost)

Your backend (e.g. srusystem in Docker) must bind to **0.0.0.0** so it accepts connections from the network.

- **Django:** `python manage.py runserver 0.0.0.0:8000`
- **Docker:** The app inside the container should listen on `0.0.0.0:8000`. In docker-compose, use `ports: - "8000:8000"`.

## 2. Test from your PC first

On your laptop, open a browser and go to:

- **http://192.168.5.111:8000**

If this does **not** load, the backend is not listening on your PC’s IP. Fix the backend/Docker to use `0.0.0.0:8000` and expose port 8000.

## 3. Allow port 8000 in Windows Firewall

Windows often blocks incoming connections.

1. Open **Windows Defender Firewall** → **Advanced settings** → **Inbound Rules**.
2. **New Rule** → Port → TCP → **8000** → Allow the connection → apply to Private (and Domain if needed).

Or temporarily turn off the firewall to test (turn it back on after).

## 4. Test from your phone’s browser

On the phone (same Wi‑Fi), open **Chrome** and go to:

- **http://192.168.5.111:8000**

- If it **loads**: the network is fine; reload the Vallejera app and try login again.
- If it **does not load**: the problem is firewall or backend binding (steps 1–3).

## 5. Same Wi‑Fi

Confirm the phone is on **Wi‑Fi** (not mobile data) and on the **same network** as the laptop (192.168.5.x).
