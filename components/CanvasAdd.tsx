import { VFC } from "react";
import { useRecoilState } from "recoil";
import { v4 } from "uuid";
import { ElementListState, SelectedElementIdState } from "../data/atoms";
import useViewControl from "../hooks/useViewControl";
import { FONTS, TEXT_COLORS } from "../styles/text";
import { CanvasElementItem } from "../types/elements";
import styles from "./CanvasAdd.module.css";

interface CanvasAddProps {
  modify: {
    active: boolean;
    x: number;
    y: number;
  };
  setActive: (a: boolean) => void;
  onAdd: () => void;
}

const CanvasAdd: VFC<CanvasAddProps> = ({ modify, setActive, onAdd }) => {
  const view = useViewControl();
  const [elementList, setElementList] = useRecoilState(ElementListState);
  const [_, setSelectedElementId] = useRecoilState(SelectedElementIdState);

  const addAndSelectNewElement = (e: CanvasElementItem) => {
    let newElements = [...elementList];
    newElements.push(e);
    setSelectedElementId({ id: elementList.length, editing: true });
    setElementList(newElements);
    onAdd();
  };

  const handleDraw = (e: any) => {
    // TODO
    // append new draw item to ElementListState
    // set SelectedElement to this with editing = true
  };

  const handleText = (e: React.MouseEvent) => {
    e.preventDefault();

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
      x: Math.round(modify.x / view.view.scale),
      y: Math.round(modify.y / view.view.scale),
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
  };

  const handleImage = (e: any) => {
    e.preventDefault();
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
      x: Math.round(modify.x / view.view.scale),
      y: Math.round(modify.y / view.view.scale),
    };
    addAndSelectNewElement(newImageElement);
  };

  return (
    <div
      className={styles.tooltip}
      style={{ top: modify.y, left: modify.x }}
      onMouseLeave={() => setTimeout(() => setActive(!modify.active), 180)}
    >
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
