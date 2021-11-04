import { useEffect, VFC } from "react";
import { CanvasElementItem } from "../../types/elements";
import { nextInArrayRotate } from "../../utils";
import { FONTS, TEXT_COLORS } from "../../styles/text";

import styles from "./elements.module.css";
import useViewControl from "../../hooks/useViewControl";

interface TextElementProps {
  element: CanvasElementItem;
  editing: boolean;
  onUpdate: (e: CanvasElementItem) => void;
}

const TextElement: VFC<TextElementProps> = ({ element, editing, onUpdate }) => {
  const view = useViewControl();

  useEffect(() => {
    if (element.textParams?.fontSize && element.scaledHeight && element.scaledWidth) {
      const numOfChars = element.data.length;
      const elementArea = element.scaledWidth * element.scaledHeight;
      const newFontSize = Math.round(Math.sqrt(elementArea / numOfChars));
      const scaledMax = Math.round(190 * view.view.scale);
      const fontSize = `${newFontSize > scaledMax ? scaledMax : newFontSize}px`;
      onUpdate({ ...element, textParams: { ...element.textParams, fontSize } });
    }
  }, [element.scaledHeight, element.scaledWidth, element.data, view.view.scale]);

  const rotateFont = (e: React.MouseEvent) => {
    let newFont = nextInArrayRotate(FONTS, element.textParams?.fontFamily);
    onUpdate({ ...element, textParams: { ...element.textParams, fontFamily: newFont } });
  };

  const rotateColor = (e: React.MouseEvent) => {
    let newColor = nextInArrayRotate(TEXT_COLORS, element.textParams?.color);
    onUpdate({ ...element, textParams: { ...element.textParams, color: newColor } });
  };

  if (editing) {
    return (
      <div style={{ width: element.scaledWidth, height: element.scaledHeight, overflow: "clip" }}>
        <textarea
          autoFocus
          name="text-field"
          value={element.data}
          onChange={(e) => onUpdate({ ...element, data: e.target.value })}
          disabled={!editing}
          style={{
            overflowWrap: "anywhere",
            ...element.textParams,
            width: element.scaledWidth,
            height: element.scaledHeight,
            resize: "none",
          }}
        />
        <div className={styles.elementBottomButtons}>
          <button onClick={rotateFont}>Font</button>
          <button onClick={rotateColor}>Color</button>
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          ...element.textParams,
          overflowWrap: "anywhere",
          width: element.scaledWidth,
          height: element.scaledHeight,
        }}
      >
        <p>{element.data}</p>
      </div>
    );
  }
};

export default TextElement;
