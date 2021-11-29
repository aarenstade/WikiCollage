import { atom, selector, DefaultValue } from "recoil";
import { Collage } from "../types/collage";
import { CanvasElementItem } from "../types/elements";
import { ViewControl } from "../types/view";
import { defaultCollage } from "./defaults";

export const CollageState = atom<Collage>({
  key: "CollageState",
  default: defaultCollage,
});

export const CollageOpenState = selector({
  key: "CollageOpenState",
  get: ({ get }) => get(CollageState).open,
});

export const ViewControlState = atom<ViewControl>({
  key: "ViewControlState",
  default: { x: 0, y: 0, scale: 0.3 },
});

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
