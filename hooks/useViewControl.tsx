import { useRecoilState } from "recoil";
import { ViewControlState } from "../data/atoms";
import { ViewControl } from "../types/view";

interface ViewControlHook {
  view: ViewControl;
  zoomIn: () => void;
  zoomOut: () => void;
  setScale: (n: number) => void;
}

const useViewControl = (): ViewControlHook => {
  const [viewControl, setViewControl] = useRecoilState(ViewControlState);
  const scaleInc = 0.1;

  const zoomIn = () => {
    if (viewControl.scale >= 0.1) {
      setViewControl({ ...viewControl, scale: viewControl.scale + scaleInc });
    } else {
      setViewControl({ ...viewControl, scale: viewControl.scale + 0.02 });
    }
  };
  const zoomOut = () => {
    if (viewControl.scale > 0.1) {
      setViewControl({ ...viewControl, scale: viewControl.scale - scaleInc });
    } else {
      if (viewControl.scale <= 0.05) {
        setViewControl({ ...viewControl, scale: 0.05 });
      } else {
        setViewControl({ ...viewControl, scale: viewControl.scale - 0.02 });
      }
    }
  };

  const setScale = (n: number) => setViewControl({ ...viewControl, scale: n });

  return {
    view: viewControl,
    zoomIn,
    zoomOut,
    setScale,
  };
};

export default useViewControl;
