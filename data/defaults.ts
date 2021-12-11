import { v4 } from "uuid";
import { FONTS, TEXT_COLORS } from "../styles/text";
import { Collage } from "../types/collage";
import { CanvasElementItem } from "../types/elements";

interface NewCanvasElementInput {
  width: number;
  height: number;
  scale: number;
  pos: { x: number; y: number };
}

export const newImageElement = ({ width, height, scale, pos }: NewCanvasElementInput): CanvasElementItem => {
  // TODO set element to max width height and adusted scaledWidth & scaledHeight
  return {
    html_id: v4(),
    type: "image",
    data: "",
    width: width / scale,
    height: height / scale,
    scaledWidth: width,
    scaledHeight: height,
    x: Math.round(pos.x / scale) - width / 2,
    y: Math.round(pos.y / scale) - width / 2,
  };
};

export const newTextElement = ({ width, height, scale, pos }: NewCanvasElementInput): CanvasElementItem => {
  return {
    html_id: v4(),
    type: "text",
    data: "Text Here",
    width: width / scale,
    height: height / scale,
    scaledWidth: width,
    scaledHeight: height,
    x: Math.round(pos.x / scale),
    y: Math.round(pos.y / scale),
    textParams: {
      fontSize: "40px",
      fontFamily: FONTS[0],
      color: TEXT_COLORS[0],
      fontWeight: "normal",
      margin: "0",
      padding: "0",
    },
  };
};

export const defaultCollage: Collage = {
  addition: null,
  topic: null,
  loading: true,
  open: true,
};
