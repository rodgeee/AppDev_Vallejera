/**
 * API base URL — your backend (e.g. srusystem in Docker) must be reachable here.
 *
 * Physical device: use your PC's IP so the phone can reach it over Wi‑Fi.
 * - Run "ipconfig" in PowerShell and copy your IPv4 Address (e.g. 192.168.1.5).
 * - Replace the IP below; phone and PC must be on the same Wi‑Fi.
 * - Docker: expose port 8000 to the host (e.g. ports: "8000:8000" in docker-compose).
 *
 * Emulator only: use 'http://10.0.2.2:8000'
 */
export const API_BASE_URL = 'http://127.0.0.1:8000';
