import styles from "./ElementsLayerList.module.css";
import useElements from "../hooks/useElements";
import { CanvasElementItem } from "../types/elements";

const ElementsLayerList = () => {
  const elements = useElements();
  return (
    <div className={styles.layerList}>
      <ul>
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
  );
};

export default ElementsLayerList;
