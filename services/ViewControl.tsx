import { useRecoilState } from "recoil";
import { ViewControlState } from "../data/atoms";
import { ViewControl } from "../types/view";

interface ViewControlHook {
  view: ViewControl;
  zoomIn: () => void;
  zoomOut: () => void;
}

const useViewControl = (): ViewControlHook => {
  const [viewControl, setViewControl] = useRecoilState(ViewControlState);
  const scaleInc = 0.1;

  const zoomIn = () => viewControl.scale < 1 && setViewControl({ ...viewControl, scale: viewControl.scale + scaleInc });
  const zoomOut = () =>
    viewControl.scale > 0.1 && setViewControl({ ...viewControl, scale: viewControl.scale - scaleInc });

  return {
    view: viewControl,
    zoomIn,
    zoomOut,
  };
};

export default useViewControl;
