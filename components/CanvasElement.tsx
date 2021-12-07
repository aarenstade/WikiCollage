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
import { MAX_ELEMENT_PIXEL_AREA } from "../config";

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

  // respond to scale changes
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
    const newElement = { ...localElement, x: absX, y: absY };
    setLocalElement(newElement);
    onUpdate(newElement);
  };

  const setSize = (w: number, h: number, sw: number, sh: number) => {
    const newElement = { ...localElement, width: w, height: h, scaledWidth: sw, scaledHeight: sh };
    rndRef.current.updateSize({ width: sw, height: sh });
    setLocalElement(newElement);
    onUpdate(newElement);
  };

  const calcMaxImageDim = (aspect: number): { width: number; height: number } => {
    const width = Math.round(Math.sqrt(MAX_ELEMENT_PIXEL_AREA / (1 / aspect)));
    const height = Math.round(width / aspect);
    return { width, height };
  };

  const handleResize = (s: any) => {
    const scale = viewControl.view.scale;
    const absW = Math.round(s.offsetWidth / scale);
    const absH = Math.round(s.offsetHeight / scale);
    if (absW * absH >= MAX_ELEMENT_PIXEL_AREA) {
      const aspect = element.aspectRatio ? element.aspectRatio : 1;
      const { width, height } = calcMaxImageDim(aspect);
      const scaledWidth = width * scale;
      const scaledHeight = height * scale;
      setSize(width, height, scaledWidth, scaledHeight);
    } else {
      setSize(absW, absH, s.offsetWidth, s.offsetHeight);
    }
  };

  // respond to image changes
  // TODO (bug not responding to state change when new image is added)
  useEffect(() => {
    if (element.data && element.type === "image") {
      const { width, height } = calcMaxImageDim(element.aspectRatio ? element.aspectRatio : 1);
      const scale = viewControl.view.scale;
      const scaledWidth = width * scale;
      const scaledHeight = height * scale;
      setSize(width, height, scaledWidth, scaledHeight);
    }
  }, [element.data]);

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
      onResizeStop={(_, d, ref) => handleResize(ref)}
      lockAspectRatio={localElement.aspectRatio ? localElement.aspectRatio : false}
      enableResizing={selection.editing}
      resizeHandleStyles={selection.selected ? resizeHandleStyles : {}}
      style={{ zIndex: 3, border: `${selection.selected ? "0.5px solid gray" : "none"}` }}
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
