import { useState, useEffect } from "react";

export function useDimensions(ref) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(element);
    
    // Set initial size
    setDimensions({
      width: element.offsetWidth,
      height: element.offsetHeight,
    });

    return () => resizeObserver.disconnect();
  }, [ref]);

  return dimensions;
}
