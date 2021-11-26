import { useEffect, useRef, VFC } from "react";
import { CanvasElementItem } from "../types/elements";
import { Rnd } from "react-rnd";
import styles from "./CanvasElement.module.css";

import TextElement from "./elements/TextElement";
import useViewControl from "../hooks/useViewControl";
import useSelectedElement from "../hooks/useSelectedElement";
import ImageElement from "./elements/ImageElement";

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
  onUpdate: (e: CanvasElementItem) => void;
  onDelete: () => void;
}

interface CanvasElementHeaderProps {
  id: number;
  onUpdate: () => void;
  onDelete: () => void;
}

const CanvasElementHeader: VFC<CanvasElementHeaderProps> = ({ id, onUpdate, onDelete }) => {
  const element = useSelectedElement(id);
  return (
    <div className={styles.elementHeader}>
      {element.editing && <button onClick={() => onDelete()}>Delete</button>}
      {element.selected && !element.editing && (
        <button onClick={() => element.setId({ id, editing: true })}>Edit</button>
      )}
      {element.selected && element.editing && <button onClick={() => onUpdate()}>Save</button>}
    </div>
  );
};

const CanvasElement: VFC<CanvasElementProps> = ({ id, element, onUpdate, onDelete }) => {
  const rndRef = useRef<any>();

  const viewControl = useViewControl();
  const selection = useSelectedElement(id);

  const handleSave = () => {
    onUpdate(element);
    selection.setId(null);
  };

  useEffect(() => {
    if (!selection.editing) onUpdate(element);
  }, [selection.editing]);

  useEffect(() => {
    const scale = viewControl.view.scale;
    const scaledWidth = element.width * scale;
    const scaledHeight = element.height * scale;
    const relativeX = element.x * scale;
    const relativeY = element.y * scale;
    rndRef.current.updateSize({ width: scaledWidth, height: scaledHeight });
    rndRef.current.updatePosition({ x: relativeX, y: relativeY });
    onUpdate({ ...element, scaledWidth, scaledHeight });
  }, [viewControl.view.scale]);

  const updatePosition = (d: any) => {
    const { x, y } = d;
    const scale = viewControl.view.scale;
    const absX = Math.round(x / scale);
    const absY = Math.round(y / scale);
    rndRef.current.updatePosition({ x, y });
    onUpdate({ ...element, x: absX, y: absY });
  };

  const handleResize = (s: any) => {
    const scaledWidth = s.offsetWidth;
    const scaledHeight = s.offsetHeight;
    const scale = viewControl.view.scale;
    const absWidth = Math.round(scaledWidth / scale);
    const absHeight = Math.round(scaledHeight / scale);
    rndRef.current.updateSize({ width: scaledWidth, height: scaledHeight });
    const newElement = { ...element, width: absWidth, height: absHeight, scaledWidth, scaledHeight };
    onUpdate(newElement);
  };

  return (
    <Rnd
      id={element.html_id}
      ref={rndRef}
      default={{
        width: element.width || "auto",
        height: element.height || "auto",
        x: element.x,
        y: element.y,
      }}
      onDrag={(_, d) => updatePosition(d)}
      onResize={(_, direction, ref) => handleResize(ref)}
      resizeHandleStyles={selection.selected ? resizeHandleStyles : {}}
      style={{ zIndex: 3, border: `${selection.selected ? "0.5px solid gray" : "none"}` }}
      enableResizing={selection.editing}
    >
      <div
        className={styles.elementContainer}
        style={{
          width: element.scaledWidth,
          height: element.scaledHeight,
        }}
        onDoubleClick={() => selection.setId({ id, editing: true })}
      >
        <CanvasElementHeader id={id} onUpdate={handleSave} onDelete={onDelete} />
        {element.type === "text" && (
          <TextElement editing={selection.editing} element={element} onUpdate={(e) => onUpdate(e)} />
        )}
        {element.type === "image" && (
          <ImageElement editing={selection.editing} element={element} onUpdate={(e) => onUpdate(e)} />
        )}
        {/* {element.type === "draw" && <DrawElement element={element\} onDraw={(e) => onUpdate\(e)} />} */}
      </div>
    </Rnd>
  );
};

export default CanvasElement;
