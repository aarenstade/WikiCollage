import { useEffect, useRef, useState, VFC } from "react";
import { CanvasElementItem } from "../types/elements";
import { Rnd } from "react-rnd";
import { useRecoilState } from "recoil";
import { SelectedElementIdState } from "../data/atoms";
import styles from "./CanvasElement.module.css";

import TextElement from "./elements/TextElement";
import useViewControl from "../hooks/useViewControl";
import useSelectedElement from "../hooks/useSelectedElement";

const cornerHandle = {
  backgroundColor: "white",
  width: "10px",
  height: "10px",
  borderRadius: "6px",
  padding: "0",
};

const resizeHandleStyles = {
  bottomLeft: cornerHandle,
  topLeft: cornerHandle,
  topRight: cornerHandle,
  bottomRight: cornerHandle,
};

interface CanvasElementProps {
  id: number;
  element: CanvasElementItem;
  onSave: (e: CanvasElementItem) => void;
}

interface CanvasElementHeaderProps {
  id: number;
  onSave: () => void;
}

const CanvasElementHeader: VFC<CanvasElementHeaderProps> = ({ id, onSave }) => {
  const element = useSelectedElement(id);
  return (
    <div className={styles.elementHeader}>
      {element.selected && !element.editing && (
        <button onClick={() => element.setId({ id, editing: true })}>Edit</button>
      )}
      {element.selected && element.editing && <button onClick={() => onSave()}>Save</button>}
    </div>
  );
};

const CanvasElement: VFC<CanvasElementProps> = ({ id, element, onSave }) => {
  const rndRef = useRef<any>();

  const viewControl = useViewControl();
  const selection = useSelectedElement(id);

  const [localElement, setLocalElement] = useState(element);

  const handleSave = () => onSave(localElement);

  useEffect(() => {
    const scale = viewControl.view.scale;
    const scaledWidth = localElement.width * scale;
    const scaledHeight = localElement.height * scale;
    const relativeX = localElement.x * scale;
    const relativeY = localElement.y * scale;
    setLocalElement({ ...localElement, scaledWidth, scaledHeight, relativeX, relativeY });
    rndRef.current.updateSize({ width: scaledWidth, height: scaledHeight });
    rndRef.current.updatePosition({ x: relativeX, y: relativeY });
  }, [viewControl.view.scale]);

  const updatePosition = (d: any) => {
    const { x, y } = d;
    const scale = viewControl.view.scale;
    const absX = Math.round(x / scale);
    const absY = Math.round(y / scale);
    rndRef.current.updatePosition({ x, y });
    setLocalElement({ ...localElement, x: absX, y: absY });
  };

  const handleResize = (s: any) => {
    const scaledWidth = s.offsetWidth;
    const scaledHeight = s.offsetHeight;
    const scale = viewControl.view.scale;
    const absWidth = Math.round(scaledWidth / scale);
    const absHeight = Math.round(scaledHeight / scale);
    rndRef.current.updateSize({ width: scaledWidth, height: scaledHeight });
    setLocalElement({ ...localElement, width: absWidth, height: absHeight, scaledWidth, scaledHeight });
  };

  return (
    <Rnd
      ref={rndRef}
      default={{
        width: localElement.width || "auto",
        height: localElement.height || "auto",
        x: localElement.x,
        y: localElement.y,
      }}
      onDragStop={(_, d) => updatePosition(d)}
      onResize={(_, direction, ref) => handleResize(ref)}
      resizeHandleStyles={selection.selected ? resizeHandleStyles : {}}
      style={{ zIndex: 3 }}
      disabled={selection.selected}
    >
      <div
        className={styles.elementContainer}
        style={{
          width: localElement.scaledWidth,
          height: localElement.scaledHeight,
        }}
        onDoubleClick={() => selection.setId({ id, editing: true })}
      >
        <CanvasElementHeader id={id} onSave={handleSave} />
        {element.type === "text" && (
          <TextElement editing={selection.editing} element={localElement} onUpdate={(e) => setLocalElement(e)} />
        )}
        {/* {element.type === "draw" && <DrawElement element={localElement} onDraw={(e) => setLocalElement(e)} />} */}
      </div>
    </Rnd>
  );
};

export default CanvasElement;
