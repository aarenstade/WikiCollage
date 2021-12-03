import { useEffect, useState, VFC } from "react";
import { MURAL_DIMENSION } from "../../config";
import useViewControl from "../../hooks/useViewControl";

import styles from "../../styles/layers.module.css";

interface Props {
  onClick: (e: React.MouseEvent) => void;
}

const TouchLayer: VFC<Props> = ({ onClick }) => {
  const view = useViewControl();
  const [dim, setDim] = useState(MURAL_DIMENSION);

  useEffect(() => {
    setDim(MURAL_DIMENSION * view.view.scale);
  }, [view.view.scale]);

  return <div style={{ width: dim, height: dim }} className={styles.touchLayer} onClick={onClick} />;
};

export default TouchLayer;
