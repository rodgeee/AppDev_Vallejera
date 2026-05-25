import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { performSessionLogout } from '../services/sessionLogout';

/** Clears JWT and Google session — bag items stay saved on this device. */
export function useLogout() {
  const dispatch = useDispatch();

  return useCallback(() => performSessionLogout(dispatch), [dispatch]);
}
