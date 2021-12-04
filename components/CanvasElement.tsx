import { useEffect, useRef, useState, VFC } from "react";
import { CanvasElementItem } from "../types/elements";
import { Rnd } from "react-rnd";
import styles from "./CanvasElement.module.css";

import TextElement from "./elements/TextElement";
import useViewControl from "../hooks/useViewControl";
import useSelectedElement from "../hooks/useSelectedElement";
import ImageElement from "./elements/ImageElement";
import DeleteIcon from "./icons/delete-dark.svg";
import { NormalButton, IconButton } from "./Buttons";

const cornerHandle = {
  backgroundColor: "white",
  width: "10px",
  height: "10px",
  borderRadius: "0 0 0px 6px",
  margin: "0",
  padding: "0",
};

const resizeHandleStyles = {
  bottomLeft: { ...cornerHandle, transform: "rotate(0deg)" },
  topLeft: { ...cornerHandle, transform: "rotate(90deg)" },
  topRight: { ...cornerHandle, transform: "rotate(180deg)" },
  bottomRight: { ...cornerHandle, transform: "rotate(270deg)" },
};

interface CanvasElementProps {
  id: number;
  element: CanvasElementItem;
  onUpdate: (e: CanvasElementItem) => void;
  onDelete: () => void;
}

interface CanvasElementControlButtonsProps {
  id: number;
  onUpdate: () => void;
  onDelete: () => void;
}

const CanvasElementControlButtons: VFC<CanvasElementControlButtonsProps> = ({ id, onUpdate, onDelete }) => {
  const element = useSelectedElement(id);
  return (
    <div className={styles.elementControlButtons}>
      {element.editing && <IconButton onClick={() => onDelete()} icon={<DeleteIcon />} />}
      {element.selected && element.editing && <NormalButton onClick={() => onUpdate()} text="Save" />}
    </div>
  );
};

const CanvasElement: VFC<CanvasElementProps> = ({ id, element, onUpdate, onDelete }) => {
  const rndRef = useRef<any>();

  const viewControl = useViewControl();
  const selection = useSelectedElement(id);

  const [localElement, setLocalElement] = useState(element);

  const handleSave = () => {
    onUpdate(localElement);
    selection.setId(null);
  };

  useEffect(() => {
    if (!selection.editing) onUpdate(localElement);
  }, [selection.editing]);

  useEffect(() => {
    const scale = viewControl.view.scale;
    const scaledWidth = localElement.width * scale;
    const scaledHeight = localElement.height * scale;
    const relativeX = localElement.x * scale;
    const relativeY = localElement.y * scale;
    setLocalElement({ ...localElement, scaledWidth, scaledHeight });
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
      onDrag={(_, d) => updatePosition(d)}
      onResize={(_, direction, ref) => handleResize(ref)}
      enableResizing={selection.editing}
      resizeHandleStyles={selection.selected ? resizeHandleStyles : {}}
      style={{ zIndex: 3, border: `${selection.selected ? "0.5px solid gray" : "none"}` }}
      disableDragging={!selection.editing}
    >
      <div
        className={styles.elementContainer}
        style={{
          width: localElement.scaledWidth,
          height: localElement.scaledHeight,
        }}
        onDoubleClick={() => selection.setId({ id, editing: true })}
      >
        <CanvasElementControlButtons id={id} onUpdate={handleSave} onDelete={onDelete} />
        {element.type === "text" && (
          <TextElement editing={selection.editing} element={localElement} onUpdate={(e) => setLocalElement(e)} />
        )}
        {element.type === "image" && (
          <ImageElement editing={selection.editing} element={localElement} onUpdate={(e) => setLocalElement(e)} />
        )}
      </div>
    </Rnd>
  );
};

export default CanvasElement;
