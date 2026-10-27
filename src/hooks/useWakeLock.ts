import { useCallback, useEffect, useRef, useState } from 'react';

/** Keeps the screen on while cooking. The browser drops the lock when the tab is hidden, so re-acquire on return. */
export function useWakeLock() {
  const supported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  const [active, setActive] = useState(false);
  const sentinel = useRef<WakeLockSentinel | null>(null);
  const wanted = useRef(false);

  const acquire = useCallback(async () => {
    try {
      const lock = await navigator.wakeLock.request('screen');
      lock.addEventListener('release', () => setActive(false));
      sentinel.current = lock;
      setActive(true);
    } catch {
      setActive(false);
    }
  }, []);

  const toggle = useCallback(async () => {
    if (!supported) return;
    if (wanted.current) {
      wanted.current = false;
      await sentinel.current?.release();
      sentinel.current = null;
    } else {
      wanted.current = true;
      await acquire();
    }
  }, [supported, acquire]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && wanted.current && (!sentinel.current || sentinel.current.released)) {
        void acquire();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      void sentinel.current?.release();
    };
  }, [acquire]);

  return { supported, active, toggle };
}
