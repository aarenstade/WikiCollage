import { useRecoilState } from "recoil";
import { ElementListState, SelectedElementIdState } from "../data/atoms";
import { newImageElement, newTextElement } from "../data/defaults";
import { CanvasElementItem } from "../types/elements";
import useViewControl from "./useViewControl";
import { Pos } from "../types/view";

interface UseElementsHook {
  elements: CanvasElementItem[];
  addImageElement: (pos: Pos) => CanvasElementItem;
  addTextElement: (pos: Pos) => CanvasElementItem;
  clearElements: () => void;
}

const useElements = (): UseElementsHook => {
  const view = useViewControl();
  const [elementList, setElementList] = useRecoilState(ElementListState);
  const [_, setSelectedElementId] = useRecoilState(SelectedElementIdState);

  const addAndSelectNewElement = (el: CanvasElementItem) => {
    let newElements = [...elementList];
    newElements.push(el);
    setSelectedElementId({ id: elementList.length, editing: true });
    setElementList(newElements);
  };

  const addImageElement = (pos: Pos) => {
    const imageElement = newImageElement({
      width: 200,
      height: 200,
      scale: view.view.scale,
      pos,
    });
    addAndSelectNewElement(imageElement);
    return imageElement;
  };

  const addTextElement = (pos: Pos) => {
    const textElement = newTextElement({ width: 300, height: 100, scale: view.view.scale, pos });
    addAndSelectNewElement(textElement);
    return textElement;
  };

  const clearElements = () => setElementList([]);

  return {
    elements: elementList,
    addImageElement,
    addTextElement,
    clearElements,
  };
};

export default useElements;
