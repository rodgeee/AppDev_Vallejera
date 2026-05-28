import { useCallback, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

/** How often order screens re-fetch while visible (admin status changes). */
export const ORDER_POLL_INTERVAL_MS = 15_000;

type Options = {
  intervalMs?: number;
  enabled?: boolean;
};

/**
 * Runs `onPoll` when the screen gains focus, on a fixed interval while focused,
 * and when the app returns to the foreground.
 */
export function useFocusPolling(onPoll: () => void | Promise<void>, options?: Options): void {
  const intervalMs = options?.intervalMs ?? ORDER_POLL_INTERVAL_MS;
  const enabled = options?.enabled ?? true;
  const onPollRef = useRef(onPoll);
  onPollRef.current = onPoll;

  useFocusEffect(
    useCallback(() => {
      if (!enabled) {
        return undefined;
      }

      let cancelled = false;
      const tick = () => {
        if (!cancelled) {
          void onPollRef.current();
        }
      };

      tick();
      const intervalId = setInterval(tick, intervalMs);
      const appStateSub = AppState.addEventListener('change', (next: AppStateStatus) => {
        if (next === 'active') {
          tick();
        }
      });

      return () => {
        cancelled = true;
        clearInterval(intervalId);
        appStateSub.remove();
      };
    }, [enabled, intervalMs]),
  );
}
