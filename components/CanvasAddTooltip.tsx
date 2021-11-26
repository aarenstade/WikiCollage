import { VFC } from "react";
import useElements from "../hooks/useElements";
import styles from "./CanvasAddTooltip.module.css";

interface CanvasAddTooltipProps {
  modify: {
    active: boolean;
    x: number;
    y: number;
  };
  setActive: (a: boolean) => void;
  onAdd: () => void;
}

const CanvasAddTooltip: VFC<CanvasAddTooltipProps> = ({ modify, setActive, onAdd }) => {
  const elements = useElements();
  const handleImage = (e: any) => elements.addImageElement({ x: modify.x, y: modify.y });
  const handleText = (e: any) => elements.addTextElement({ x: modify.x, y: modify.y });
  const handleDraw = (e: any) => elements.addDrawElement({ x: modify.x, y: modify.y });

  return (
    <div
      className={styles.tooltip}
      style={{ top: `calc(${modify.y}px - var(--navbar-offset))`, left: modify.x }}
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

export default CanvasAddTooltip;
