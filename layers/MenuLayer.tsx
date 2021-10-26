import { VFC } from "react";
import styles from "../styles/layers.module.css";
import useViewControl from "../services/ViewControl";

//shows tooltip dialogs

const MenuLayer: VFC = () => {
  const view = useViewControl();

  return (
    <div className={styles.menuLayer}>
      <button style={{ top: 0 }} onClick={() => view.zoomIn()}>
        Zoom In
      </button>
      <button style={{ top: "30px" }} onClick={() => view.zoomOut()}>
        Zoom Out
      </button>
    </div>
  );
};

export default MenuLayer;
