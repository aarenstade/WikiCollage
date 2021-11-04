import { useEffect, useRef, useState } from "react";

// canvas within ElementsLayer that responds to click events

export const useFullCanvas = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [windowDimensions, setWindowDimensions] = useState({ width: 500, height: 500 });

  const updateWidthAndHeight = () => setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });

  const resizeCanvas = (w: number, h: number) => {
    const _canvas = ref.current;
    var tempCanvas = document.createElement("canvas");
    var tempContext = tempCanvas.getContext("2d");
    if (tempContext && _canvas) {
      tempCanvas.width = w;
      tempCanvas.height = h;
      tempContext.fillStyle = "transparent";
      tempContext.fillRect(0, 0, w, h);
      tempContext.drawImage(_canvas, 0, 0);
      _canvas.width = w;
      _canvas.height = h;
      const _ctx = _canvas.getContext("2d");
      _ctx!.drawImage(tempCanvas, 0, 0);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidthAndHeight);
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    return () => window.removeEventListener("resize", updateWidthAndHeight);
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (canvas) resizeCanvas(windowDimensions.width, windowDimensions.height);
  }, [windowDimensions]);

  return { ref };
};

export default useFullCanvas;
