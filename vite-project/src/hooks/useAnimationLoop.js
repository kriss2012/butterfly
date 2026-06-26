import { useEffect, useRef } from "react";

export function useAnimationLoop(callback, active = true) {
  const requestRef = useRef();
  const tickRef = useRef(0);
  const callbackRef = useRef(callback);

  // Keep callback ref updated to prevent resetting the loop
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active) return;

    const render = () => {
      tickRef.current += 1;
      callbackRef.current(tickRef.current);
      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(requestRef.current);
  }, [active]);

  return tickRef;
}
