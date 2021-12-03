import { useEffect, useRef, VFC } from "react";
import { CanvasElementItem } from "../../types/elements";
import { nextInArrayRotate } from "../../utils/utils";
import { FONTS, TEXT_COLORS } from "../../styles/text";

import Image from "next/image";

interface DrawElementProps {
  element: CanvasElementItem;
  onDraw: (e: CanvasElementItem) => void;
}

const DrawElement: VFC<DrawElementProps> = ({ element, onDraw }) => {
  const Canvas = () => {
    const ref = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {}, []);

    return (
      <div>
        <canvas ref={ref} />
      </div>
    );
  };

  if (element.data) {
    return (
      <div>
        <Image src={element.data} alt="image" />
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default DrawElement;
