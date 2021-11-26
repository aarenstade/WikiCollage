import { useRecoilState } from "recoil";
import { v4 } from "uuid";
import { ElementListState, SelectedElementIdState } from "../data/atoms";
import { FONTS, TEXT_COLORS } from "../styles/text";
import { CanvasElementItem } from "../types/elements";
import { Pos } from "../types/view";
import useViewControl from "./useViewControl";

interface UseElementsHook {
  elements: CanvasElementItem[];
  addImageElement: (pos: Pos) => CanvasElementItem;
  addTextElement: (pos: Pos) => CanvasElementItem;
  // addDrawElement: (pos: Pos) => CanvasElementItem;
}

const useElements = (): UseElementsHook => {
  const view = useViewControl();
  const [elementList, setElementList] = useRecoilState(ElementListState);
  const [selectedElementId, setSelectedElementId] = useRecoilState(SelectedElementIdState);

  const addAndSelectNewElement = (el: CanvasElementItem) => {
    let newElements = [...elementList];
    newElements.push(el);
    setSelectedElementId({ id: elementList.length, editing: true });
    setElementList(newElements);
  };

  const addImageElement = (pos: Pos) => {
    let width = 200,
      height = 200;
    const newImageElement: CanvasElementItem = {
      html_id: v4(),
      type: "image",
      data: "",
      width: width / view.view.scale,
      height: height / view.view.scale,
      scaledWidth: width,
      scaledHeight: height,
      x: Math.round(pos.x / view.view.scale) - width / 2,
      y: Math.round(pos.y / view.view.scale) - width / 2,
    };
    addAndSelectNewElement(newImageElement);
    return newImageElement;
  };

  const addTextElement = (pos: Pos) => {
    const width = 300;
    const height = 100;

    const newTextElement: CanvasElementItem = {
      html_id: v4(),
      type: "text",
      data: "Text Here",
      width: width / view.view.scale,
      height: height / view.view.scale,
      scaledWidth: width,
      scaledHeight: height,
      x: Math.round(pos.x / view.view.scale),
      y: Math.round(pos.y / view.view.scale),
      textParams: {
        fontSize: "40px",
        fontFamily: FONTS[0],
        color: TEXT_COLORS[0],
        fontWeight: "normal",
        margin: "0",
        padding: "0",
      },
    };
    addAndSelectNewElement(newTextElement);
    return newTextElement;
  };

  return {
    elements: elementList,
    addImageElement,
    addTextElement,
    // addDrawElement,
  };
};

export default useElements;
