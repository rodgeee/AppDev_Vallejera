import { useSelector } from 'react-redux';

type AuthState = {
  data?: { token?: string } | null;
};

export function useAuthToken(): string | null {
  const auth = useSelector((state: { auth?: AuthState }) => state.auth);
  const token = auth?.data?.token;
  return typeof token === 'string' && token.length > 0 ? token : null;
}
