import { useState } from "react";
import useElements from "../hooks/useElements";
import { CanvasElementItem } from "../types/elements";
import { IconButton } from "./Buttons";
import LayerIcon from "./icons/layers.svg";
import styles from "./ElementsLayerList.module.css";

const ElementsLayerList = () => {
  const elements = useElements();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.layerListContainer}>
      <IconButton
        style={{
          zIndex: 99,
          position: "fixed",
          top: "var(--navbar-offset)",
          right: expanded ? `var(--layer-list-width)` : "0",
          borderRadius: "5px 0 0 5px",
          padding: "8px",
        }}
        icon={<LayerIcon />}
        onClick={() => setExpanded(!expanded)}
      />
      <div className={`${styles.layerList} ${expanded ? styles.expanded : styles.hidden}`}>
        <ul>
          {elements.elements.length < 1 && (
            <li className={styles.layerRow}>
              <h3>No Elements</h3>
              <p>Click anywhere on the image to create one!</p>
            </li>
          )}
          {elements.elements.map((element: CanvasElementItem, i: number) => (
            <li key={i} className={styles.layerRow}>
              <h3>
                {element.type.toUpperCase()} {Math.round(i + 1)}
              </h3>
              {element.data && <p>{element.data.slice(0, 10).padEnd(3, ".")}</p>}
              <p>
                x: {Math.round(element.x)}, y: {Math.round(element.y)}
              </p>
              <p>
                h: {Math.round(element.height)}, w: {Math.round(element.width)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ElementsLayerList;
