import { atom, selector, DefaultValue } from "recoil";
import { CanvasElementItem } from "../types/elements";

export const ElementListState = atom<CanvasElementItem[]>({
  key: "ElementListState",
  default: [],
});

export const SelectedElementIdState = atom<{ id: number; editing: boolean } | null>({
  key: "SelectedElementIdState",
  default: null,
});

export const SelectedElementState = selector<CanvasElementItem>({
  key: "SelectedElementState",
  get: ({ get }) => {
    const elementList = get(ElementListState);
    const elementId = get(SelectedElementIdState);
    if (elementId) return elementList[elementId.id];
    return elementList[0];
  },
  set: ({ set, get }, newValue: CanvasElementItem | DefaultValue) => {
    if (newValue instanceof DefaultValue) return;
    const elementList = get(ElementListState);
    const oldElement = elementList.filter((element) => element.id === newValue.id);
    const elementIndex = elementList.indexOf(oldElement[0]);
    let newList = [...elementList];
    newList[elementIndex] = newValue;
    set(ElementListState, newList);
  },
});
