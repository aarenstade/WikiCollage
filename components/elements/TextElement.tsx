import { useEffect, VFC } from "react";
import { FONTS, TEXT_COLORS } from "../../styles/text";
import { CanvasElementItem } from "../../types/elements";
import { nextInArray } from "../../utils";

interface TextElementProps {
  element: CanvasElementItem;
  editing: boolean;
  onUpdate: (e: CanvasElementItem) => void;
}

const TextElement: VFC<TextElementProps> = ({ element, editing, onUpdate }) => {
  useEffect(() => {
    const fontSize = element.width ? element.width / 10 : 16;
    onUpdate({ ...element, textParams: { ...element.textParams, fontSize } });
  }, [element.width, element.height]);

  const rotateFont = (e: React.MouseEvent) => {
    let newFont = nextInArray(FONTS, element.textParams?.fontFamily);
    onUpdate({ ...element, textParams: { ...element.textParams, fontFamily: newFont } });
  };

  const rotateColor = (e: React.MouseEvent) => {
    let newColor = nextInArray(TEXT_COLORS, element.textParams?.color);
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
            width: element.width,
            height: element.height,
            resize: "none",
          }}
        />
        <div style={{ display: "absolute", bottom: "-20px" }}>
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
          width: element.width,
          height: element.height,
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
