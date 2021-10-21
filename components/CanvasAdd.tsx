import { VFC } from "react";
import { useRecoilState } from "recoil";
import { ElementListState, SelectedElementIdState } from "../data/atoms";
import { FONTS, TEXT_COLORS } from "../styles/text";
import { CanvasElementItem } from "../types/elements";
import styles from "./CanvasAdd.module.css";

// TODO
// build out higer level state component to handle all added elements

// create GeneralElement to hold elements

// create Elements layer which sits above Canvas and renders all elements

// GeneralElement
// draws bounding box around data
// shows positioned buttons for edit and delete on hover
// allows moving all children around with position absolute
// props
// type ("text", "image", "draw")
// item (text, img src data, or draw img url)

// each of these elements have "edit" property and "delete" property

// CanvasAdd shows tooltip, and modifies state by adding new element of type

// the new element is shown on layer above canvas in index.tsx called Elements

// LATER then we can create a sidebar view area to see all the elements we have

// MAYBE?
// when we resize view, we'll have to resize where the elements are??
// this is data we can derive from useCanvas and pass where we need
// the {fromTop, fromLeft} numbers will be used to position all Elements

// ADDING A NEW ITEM PROCESS
// eg. we CanvasAdd a text element
// this appends an empty text element to global ElementListState
// then we set SelectedElementState to index of new item, with editing = true
// all elements are rendered outside CanvasAdd in Elements div above Canvas in index.tsx
// CanvasAdd just shows tooltip and modifies ElementListState/SelectedElementState

interface CanvasAddProps {
  modify: {
    active: boolean;
    x: number;
    y: number;
  };
  onAdd: () => void;
}

const CanvasAdd: VFC<CanvasAddProps> = ({ modify, onAdd }) => {
  const [elementList, setElementList] = useRecoilState(ElementListState);
  const [selectedElementId, setSelectedElementId] = useRecoilState(SelectedElementIdState);

  const handleDraw = (e: any) => {
    // TODO
    // append new draw item to ElementListState
    // set SelectedElement to this with editing = true
  };

  const handleText = (e: any) => {
    const newTextElement: CanvasElementItem = {
      type: "text",
      data: "Text Here",
      width: 150,
      height: 50,
      x: modify.x,
      y: modify.y,
      textParams: {
        fontSize: 16,
        fontFamily: FONTS[0],
        color: TEXT_COLORS[0],
        fontWeight: "normal",
      },
    };
    console.log(`adding: ${newTextElement}`);
    let newElements = [...elementList];
    newElements.push(newTextElement);
    setSelectedElementId({ id: elementList.length, editing: true });
    setElementList(newElements);
    onAdd();
  };

  const handleImage = (e: any) => {
    // TODO
    // append new image item to ElementListState
    // set SelectedElement to this with editing = true
  };

  return (
    <div className={styles.tooltip} style={{ top: modify.y, left: modify.x }}>
      <ul>
        {/* TODO draw */}
        {/* <li onClick={handleDraw}>Draw</li> */}
        <li onClick={handleText}>Text</li>
        <li onClick={handleImage}>Image</li>
      </ul>
    </div>
  );
};

export default CanvasAdd;
