/* eslint-disable @next/next/no-img-element */
// this layer loads the underlying mural image

import { VFC } from "react";
import { MURAL_DIMENSION } from "../config";
import useViewControl from "../hooks/useViewControl";

import styles from "../styles/layers.module.css";

interface Props {
  mural: string;
}

const MuralLayer: VFC<Props> = ({ mural }) => {
  const viewControl = useViewControl();

  return (
    <div className={styles.full}>
      <img src={mural} alt="mural" style={{ zIndex: 1, width: `${MURAL_DIMENSION * viewControl.view.scale}px` }} />
    </div>
  );
};

export default MuralLayer;
