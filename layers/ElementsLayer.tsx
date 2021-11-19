import { useState } from "react";
import { useRecoilState } from "recoil";
import { ElementListState, SelectedElementIdState } from "../data/atoms";
import { CanvasElementItem } from "../types/elements";

import CanvasElement from "../components/CanvasElement";
import CanvasAddTooltip from "../components/CanvasAddTooltip";

import styles from "../styles/layers.module.css";
import useViewControl from "../hooks/useViewControl";
import { MURAL_DIMENSION } from "../config";
import TouchLayer from "./TouchLayer";
import useElements from "../hooks/useElements";

const ElementsLayer = () => {
  const view = useViewControl();

  const [elementsList, setElementsList] = useRecoilState(ElementListState);
  const [_, setSelectedId] = useRecoilState(SelectedElementIdState);
  const [modify, setModify] = useState({ active: false, x: 0, y: 0 });

  const elements = useElements();

  const handleClick = (e: React.MouseEvent) => {
    elements.addImageElement({ x: e.pageX, y: e.pageY });

    // if (modify.active) {
    //   setModify({ ...modify, active: false });
    // } else {
    //   setModify({ active: true, x: e.pageX, y: e.pageY });
    //   setSelectedId(null);
    // }
  };

  const saveElement = (i: number, e: CanvasElementItem) => {
    let newElements = [...elementsList];
    newElements[i] = e;
    setElementsList(newElements);
    setSelectedId(null);
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
          onSave={(e) => saveElement(i, e)}
          onDelete={() => deleteElement(i)}
        />
      ))}
      <TouchLayer onClick={handleClick} />
    </div>
  );
};

export default ElementsLayer;
