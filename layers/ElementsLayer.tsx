import { useRecoilState, useRecoilValue } from "recoil";
import { CollageOpenState, ElementListState, SelectedElementIdState } from "../data/atoms";
import { CanvasElementItem } from "../types/elements";

import CanvasElement from "../components/CanvasElement";
// import CanvasAddTooltip from "../components/CanvasAddTooltip";

import styles from "../styles/layers.module.css";
import useViewControl from "../hooks/useViewControl";
import { MURAL_DIMENSION } from "../config";
import TouchLayer from "./TouchLayer";
import useElements from "../hooks/useElements";

const ElementsLayer = () => {
  const view = useViewControl();
  const collageOpen = useRecoilValue(CollageOpenState);

  const [elementsList, setElementsList] = useRecoilState(ElementListState);
  const [selectedId, setSelectedId] = useRecoilState(SelectedElementIdState);
  // const [modify, setModify] = useState({ active: false, x: 0, y: 0 });

  const elements = useElements();

  const handleClick = (e: React.MouseEvent) => {
    collageOpen && elements.addImageElement({ x: e.pageX, y: e.pageY });
    // setSelectedId({ id: elementsList.length - 1, editing: true });
  };

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
      {/* {modify.active && (
        <CanvasAddTooltip
          modify={modify}
          setActive={(a) => setModify({ ...modify, active: a })}
          onAdd={() => setModify({ ...modify, active: false })}
        />
      )} */}
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
