// useTimer.js
import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialSeconds = 600) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => { setSeconds(initialSeconds); setElapsed(0); setRunning(false); }, [initialSeconds]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(intervalRef.current); setRunning(false); return 0; }
        return s - 1;
      });
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const format = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return { seconds, elapsed, running, formatted: format(seconds), start, pause, reset, isExpired: seconds === 0 };
};