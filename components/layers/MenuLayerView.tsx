import React from "react";
import styles from "../../styles/layers.module.css";
import ScaleSlider from "../menu/ScaleSlider";
// import useCollage from "../../hooks/useCollage";

const MenuLayerView = () => {
  //   const collage = useCollage();

  return (
    <div className={styles.menuLayer}>
      <ScaleSlider />
    </div>
  );
};

export default MenuLayerView;
