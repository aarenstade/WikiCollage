import React from "react";
import styles from "../../styles/layers.module.css";
import ScaleSlider from "../menu/ScaleSlider";

const MenuLayerView = () => {
  return (
    <div className={styles.menuLayer}>
      <ScaleSlider />
    </div>
  );
};

export default MenuLayerView;
