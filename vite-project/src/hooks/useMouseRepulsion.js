import { useState, useEffect } from "react";

export function useMouseRepulsion(containerRef) {
  const [mousePos, setMousePos] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Bound check
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        setMousePos({ x, y });
      } else {
        setMousePos(null);
      }
    };

    const handleMouseLeave = () => {
      setMousePos(null);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [containerRef]);

  return {
    mousePos,
    setMousePos
  };
}
