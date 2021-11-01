/* eslint-disable @next/next/no-img-element */
// this layer loads the underlying mural image

import { VFC } from "react";
import useViewControl from "../hooks/useViewControl";

import styles from "../styles/layers.module.css";

interface Props {
  mural: string;
}

const MuralLayer: VFC<Props> = ({ mural }) => {
  const viewControl = useViewControl();
  const dimension = 5000;

  // TODO (optimization)

  // when view control changes, calculate set of visible squares of mural
  // select those images to request and display only
  // (for now were just loading the entire image)

  return (
    <div className={styles.full}>
      <img src={mural} alt="mural" style={{ zIndex: 1, width: `${dimension * viewControl.view.scale}px` }} />
    </div>
  );
};

export default MuralLayer;
