import { CSSProperties } from "react";

export type CanvasElementType = "text" | "image";

export interface TextElementParams {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
}

export interface CanvasElementItem {
  id?: number;
  html_id: string;
  type: CanvasElementType;
  data: string;
  width: number;
  height: number;
  scaledWidth?: number;
  scaledHeight?: number;
  aspectRatio?: number;
  x: number;
  y: number;
  textParams?: CSSProperties;
}

export interface ElementToEmbed {
  uri: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
