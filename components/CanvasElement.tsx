import { useEffect, useRef, useState, VFC } from "react";
import { CanvasElementItem } from "../types/elements";
import { Rnd } from "react-rnd";
import { useRecoilState } from "recoil";
import { SelectedElementIdState } from "../data/atoms";
import styles from "./CanvasElement.module.css";

import TextElement from "./elements/TextElement";
import useViewControl from "../services/ViewControl";

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

const CanvasElement: VFC<CanvasElementProps> = ({ id, element, onSave }) => {
  const rndRef = useRef<any>();

  const viewControl = useViewControl();

  const [localElement, setLocalElement] = useState(element);
  const [selectedId, setSelectedId] = useRecoilState(SelectedElementIdState);

  const isSelected = () => (selectedId?.id === id ? true : false);
  const isEditing = () => (selectedId?.id === id && selectedId?.editing ? true : false);

  const handleSave = (e: React.MouseEvent) => {
    onSave(localElement);
    setTimeout(() => setSelectedId(null), 50);
  };

  const ElementHeader = () => {
    return (
      <div className={styles.elementHeader}>
        {isSelected() && !isEditing() && <button onClick={() => setSelectedId({ id, editing: true })}>Edit</button>}
        {isSelected() && isEditing() && <button onClick={handleSave}>Save</button>}
      </div>
    );
  };

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
      resizeHandleStyles={isSelected() ? resizeHandleStyles : {}}
      style={{ zIndex: 3 }}
      disabled={selectedId?.id === id ? false : true}
    >
      <div
        className={styles.elementContainer}
        style={{
          width: localElement.scaledWidth,
          height: localElement.scaledHeight,
        }}
        onDoubleClick={() => setSelectedId({ id, editing: true })}
      >
        <ElementHeader />
        {element.type === "text" && (
          <TextElement editing={isEditing()} element={localElement} onUpdate={(e) => setLocalElement(e)} />
        )}
        {/* {element.type === "draw" && <DrawElement element={localElement} onDraw={(e) => setLocalElement(e)} />} */}
      </div>
    </Rnd>
  );
};

export default CanvasElement;
