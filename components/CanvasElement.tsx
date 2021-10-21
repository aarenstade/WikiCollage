import { useState, VFC } from "react";
import { CanvasElementItem } from "../types/elements";
import { Rnd } from "react-rnd";
import { useRecoilState } from "recoil";
import { SelectedElementIdState } from "../data/atoms";
import styles from "./CanvasElement.module.css";

import TextElement from "./elements/TextElement";

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

  return (
    <Rnd
      default={{
        x: element.x,
        y: element.y,
        width: localElement.width || "auto",
        height: localElement.height || "auto",
      }}
      onResize={(_, direction, ref) =>
        setLocalElement({
          ...localElement,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        })
      }
      resizeHandleStyles={isSelected() ? resizeHandleStyles : {}}
      style={{ zIndex: 6 }}
      disabled={selectedId?.id === id ? false : true}
    >
      <div className={styles.elementContainer} onDoubleClick={() => setSelectedId({ id, editing: true })}>
        <ElementHeader />
        {element.type === "text" && (
          <TextElement editing={isEditing()} element={localElement} onUpdate={(e) => setLocalElement(e)} />
        )}
      </div>
    </Rnd>
  );
};

export default CanvasElement;
