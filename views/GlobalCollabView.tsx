import Canvas, { useFullCanvas } from "../components/Canvas";
import { convertBase64ToBytes, uploadImage } from "../image-utils";
import { v4 } from "uuid";
import styles from "./GlobalCollabView.module.css";
import { createContext, MutableRefObject, useContext, useState } from "react";
import { set } from "@firebase/database";
import { DATABASE_REF, STORAGE_REF } from "../client/firebase";
import { getDownloadURL } from "@firebase/storage";

import html2canvas from "html2canvas";
import { useRecoilState } from "recoil";
import { SelectedElementIdState } from "../data/atoms";

interface CanvasContextInterface {
  ref: MutableRefObject<HTMLCanvasElement | null>;
}

export const CanvasContext = createContext<CanvasContextInterface | null>(null);
export const useCanvas = () => useContext(CanvasContext);

const GlobalCollabView = () => {
  const canvas = useFullCanvas();
  const [processing, setProcessing] = useState(false);
  const [selectedId, setSelectedId] = useRecoilState(SelectedElementIdState);

  const handleSubmit = async () => {
    setProcessing(true);
    setSelectedId(null);
    const elementsRoot = document.getElementById("elements-root");
    const muralRoot = document.getElementById("mural-root");
    if (elementsRoot && muralRoot && canvas.ref.current) {
      elementsRoot.style["backgroundColor"] = "black";
      elementsRoot.style["width"] = `${canvas.ref.current.width}px`;
      elementsRoot.style["height"] = `${canvas.ref.current.height}px`;

      const muralRes = await html2canvas(muralRoot);
      const elementsRes = await html2canvas(elementsRoot);

      const mural = muralRes.toDataURL("image/png");
      const elements = elementsRes.toDataURL("image/png");

      console.log({ mural });
      console.log({ elements });
    }
    // if (elementsRoot && canvas.ref.current) {
    //   elementsRoot.style["backgroundColor"] = "black";
    //   elementsRoot.style["width"] = `${canvas.ref.current.width}px`;
    //   elementsRoot.style["height"] = `${canvas.ref.current.height}px`;

    //   const canvasRes = await html2canvas(elementsRoot);
    //   const base64 = canvasRes.toDataURL("image/png");
    //   console.log({ base64 });
    //   const bytes = convertBase64ToBytes(base64);

    //   // handle upload and database submission
    //   const layer_id = v4();
    //   const filename = `layer_${layer_id}.jpg`;

    //   const storagePath = `/layers/${filename}`;
    //   await uploadImage(bytes, storagePath);
    //   const layer = await getDownloadURL(STORAGE_REF(storagePath));

    //   console.log({ layer });

    //   await set(DATABASE_REF(`/latest_submission`), {
    //     layer,
    //     name: layer_id,
    //     timestamp: Date.now(),
    //     mural: "TODO",
    //   });

    //   setProcessing(false);
    // }
  };

  return (
    <CanvasContext.Provider value={canvas}>
      <div className={styles.globalCollabView}>
        <Canvas />
        <button className={styles.submitButton} onClick={handleSubmit} disabled={processing}>
          {processing ? "..." : "Submit"}
        </button>
      </div>
    </CanvasContext.Provider>
  );
};

export default GlobalCollabView;
