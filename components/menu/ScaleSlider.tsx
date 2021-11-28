import { useState } from "react";
import useViewControl from "../../hooks/useViewControl";
import styles from "./ScaleSlider.module.css";

const ScaleSlider = () => {
  const view = useViewControl();

  return (
    <div className={styles.scaleSliderContainer}>
      <p className={styles.scaleReadout}>{Math.round(view.view.scale * 100)}%</p>
      <input
        className={styles.scaleSlider}
        type="range"
        min="10"
        max="100"
        value={(view.view.scale * 100).toString()}
        onChange={(e) => view.setScale(parseInt(e.target.value) / 100)}
      />
    </div>
  );
};

export default ScaleSlider;
