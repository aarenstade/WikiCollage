import { useEffect, VFC } from "react";
import { CanvasElementItem } from "../../types/elements";
import { nextInArrayRotate } from "../../utils/utils";
import { FONTS, TEXT_COLORS } from "../../styles/text";

import styles from "./elements.module.css";
import useViewControl from "../../hooks/useViewControl";

// TODO - debug text offset on conversion with html2canvas
// CURRENTLY EXCLUDED

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
      const fontSize = Math.round(Math.sqrt(elementArea / numOfChars));
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
      <div>
        <textarea
          autoFocus
          name="text-field"
          value={element.data}
          onChange={(e) => onUpdate({ ...element, data: e.target.value })}
          disabled={!editing}
          className={styles.textElement}
          style={{
            overflowWrap: "anywhere",
            ...element.textParams,
            width: element.scaledWidth,
            height: element.scaledHeight,
            resize: "none",
          }}
        />
        {editing && (
          <div className={styles.elementBottomButtons}>
            <button onClick={rotateFont}>Font</button>
            <button onClick={rotateColor}>Color</button>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div
        className={styles.textElement}
        style={{
          overflowWrap: "anywhere",
          width: element.scaledWidth,
          height: element.scaledHeight,
        }}
      >
        <h1 style={{ overflowWrap: "anywhere", ...element.textParams }}>{element.data}</h1>
      </div>
    );
  }
};

export default TextElement;
