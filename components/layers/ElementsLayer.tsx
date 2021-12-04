import { useRecoilState, useRecoilValue } from "recoil";
import { CollageOpenState, ElementListState, SelectedElementIdState } from "../../data/atoms";
import { CanvasElementItem } from "../../types/elements";
import CanvasElement from "../CanvasElement";
import styles from "../../styles/layers.module.css";
import useViewControl from "../../hooks/useViewControl";
import TouchLayer from "./TouchLayer";
import useElements from "../../hooks/useElements";
import { MURAL_DIMENSION } from "../../config";

const ElementsLayer = () => {
  const view = useViewControl();
  const collageOpen = useRecoilValue(CollageOpenState);

  const [elementsList, setElementsList] = useRecoilState(ElementListState);
  const [_, setSelectedId] = useRecoilState(SelectedElementIdState);

  const elements = useElements();

  const handleClick = (e: React.MouseEvent) =>
    collageOpen && elements.addImageElement({ x: e.pageX - 50, y: e.pageY - 50 });

  const updateElement = (i: number, e: CanvasElementItem) => {
    let newElements = [...elementsList];
    newElements[i] = e;
    setElementsList(newElements);
  };

  const deleteElement = (i: number) => {
    let newElements = [...elementsList];
    newElements.splice(i, 1);
    setElementsList(newElements);
    setSelectedId(null);
  };

  return (
    <div
      className={styles.full}
      id="elements-root"
      style={{
        zIndex: 2,
        width: MURAL_DIMENSION * view.view.scale,
        height: MURAL_DIMENSION * view.view.scale,
      }}
    >
      {elementsList.map((element: CanvasElementItem, i: number) => (
        <CanvasElement
          key={i}
          id={i}
          element={element}
          onUpdate={(e) => updateElement(i, e)}
          onDelete={() => deleteElement(i)}
        />
      ))}
      <TouchLayer onClick={handleClick} />
    </div>
  );
};

export default ElementsLayer;
