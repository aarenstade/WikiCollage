import { useEffect, useState, VFC } from "react";
import { MURAL_DIMENSION } from "../config";
import useViewControl from "../hooks/useViewControl";

interface Props {
  onClick: (e: React.MouseEvent) => void;
}

const TouchLayer: VFC<Props> = ({ onClick }) => {
  const view = useViewControl();
  const [dim, setDim] = useState(MURAL_DIMENSION);

  useEffect(() => {
    setDim(MURAL_DIMENSION * view.view.scale);
  }, [view.view.scale]);

  return (
    <div
      style={{ backgroundColor: "transparent", position: "absolute", top: 0, left: 0, width: dim, height: dim }}
      onClick={onClick}
    />
  );
};

export default TouchLayer;
