import { useEffect, VFC } from "react";
import { CanvasElementItem } from "../../types/elements";
import { nextInArrayRotate } from "../../utils";
import { FONTS, TEXT_COLORS } from "../../styles/text";

interface TextElementProps {
  element: CanvasElementItem;
  editing: boolean;
  onUpdate: (e: CanvasElementItem) => void;
}

const TextElement: VFC<TextElementProps> = ({ element, editing, onUpdate }) => {
  // useEffect(() => {
  //   const fontSize = element.width ? element.width / 8 : 16;
  //   onUpdate({ ...element, textParams: { ...element.textParams, fontSize } });
  // }, [element.width, element.height]);

  useEffect(() => {
    if (element.textParams?.fontSize && element.scaledHeight && element.scaledWidth) {
      const numOfChars = element.data.length;
      const elementArea = element.scaledWidth * element.scaledHeight;
      const fontSize = Math.sqrt(Math.round(elementArea / numOfChars));
      onUpdate({ ...element, textParams: { ...element.textParams, fontSize } });
    }
  }, [element.scaledHeight, element.scaledWidth, element.data]);

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
          name="text-field"
          value={element.data}
          onChange={(e) => onUpdate({ ...element, data: e.target.value })}
          autoFocus
          style={{
            ...element.textParams,
            width: element.scaledWidth,
            height: element.scaledHeight,
            resize: "none",
          }}
        />
        <div style={{ marginBottom: "-50px" }}>
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
          width: element.scaledWidth,
          height: element.scaledHeight,
          overflowWrap: "anywhere",
          overflow: "clip",
        }}
      >
        {element.data}
      </div>
    );
  }
};

export default TextElement;
