/* eslint-disable @next/next/no-img-element */
import { VFC } from "react";
import useViewControl from "../../hooks/useViewControl";
import styles from "../../styles/layers.module.css";

import { DEFAULT_MURAL_BACKGROUND_COLOR, MURAL_DIMENSION } from "../../config";

interface Props {
  mural?: string;
}

const MuralLayer: VFC<Props> = ({ mural }) => {
  const viewControl = useViewControl();

  return (
    <div className={styles.full}>
      {mural ? (
        <img src={mural} alt="collage" style={{ zIndex: 1, width: `${MURAL_DIMENSION * viewControl.view.scale}px` }} />
      ) : (
        <div
          style={{
            backgroundColor: DEFAULT_MURAL_BACKGROUND_COLOR,
            width: `${MURAL_DIMENSION * viewControl.view.scale}px`,
            height: `${MURAL_DIMENSION * viewControl.view.scale}px`,
          }}
        />
      )}
    </div>
  );
};

export default MuralLayer;
