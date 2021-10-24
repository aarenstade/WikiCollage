import { createContext, MutableRefObject, useContext, useEffect, useRef, useState } from "react";
import { CanvasElementItem } from "../types/elements";
import CanvasAdd from "./CanvasAdd";
import { useRecoilState } from "recoil";
import { ElementListState, SelectedElementIdState } from "../data/atoms";
import CanvasElement from "./CanvasElement";
import { Submission } from "../types/canvas";
import { useCanvas } from "../views/MainView";

export const useFullCanvas = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [windowDimensions, setWindowDimensions] = useState({ width: 500, height: 500 });
  const [latestSubmission, setLatestSubmission] = useState<Submission | null>(null);

  const updateWidthAndHeight = () => setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });

  const resizeCanvas = (w: number, h: number) => {
    const _canvas = ref.current;
    var tempCanvas = document.createElement("canvas");
    var tempContext = tempCanvas.getContext("2d");
    if (tempContext && _canvas) {
      tempCanvas.width = w;
      tempCanvas.height = h;
      tempContext.fillStyle = "black";
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

  return { ref, latestSubmission };
};

const Canvas = () => {
  const canvas = useCanvas();
  const [modify, setModify] = useState({ active: false, x: 0, y: 0 });
  const [elementsList, setElementsList] = useRecoilState(ElementListState);
  const [selectedId, setSelectedId] = useRecoilState(SelectedElementIdState);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (modify.active) {
      setModify({ ...modify, active: false });
    } else {
      const canv = canvas?.ref.current;
      if (canv) {
        const rect = canv.getBoundingClientRect();
        setModify({ active: true, x: e.clientX - rect.left, y: e.clientY - rect.top });
        setSelectedId(null);
      }
    }
  };

  const saveElement = (i: number, e: CanvasElementItem) => {
    let newElements = [...elementsList];
    newElements[i] = e;
    setElementsList(newElements);
    setSelectedId(null);
  };

  return (
    <div>
      {modify.active && <CanvasAdd modify={modify} onAdd={() => setModify({ ...modify, active: false })} />}
      {elementsList.map((element: CanvasElementItem, i: number) => (
        <CanvasElement key={i} id={i} element={element} onSave={(e) => saveElement(i, e)} />
      ))}
      <canvas ref={canvas?.ref} style={{ zIndex: 3 }} onClick={handleCanvasClick} />
    </div>
  );
};

export default Canvas;
