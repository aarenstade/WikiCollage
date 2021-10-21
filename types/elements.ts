import { CSSProperties } from "react";

export type CanvasElementType = "text" | "draw" | "image";

export interface TextElementParams {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
}

export interface CanvasElementItem {
  id?: number;
  type: CanvasElementType;
  data: string;
  width?: number;
  height?: number;
  x: number;
  y: number;
  textParams?: CSSProperties;
}
