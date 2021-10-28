import React, { useState, VFC } from "react";
import styles from "../styles/layers.module.css";
import useViewControl from "../hooks/useViewControl";
import { useRecoilState } from "recoil";
import { SelectedElementIdState } from "../data/atoms";
import html2canvas from "html2canvas";
import { convertAllHtmlImagesToBase64, convertBase64ToBytes, uploadImage } from "../image-utils";
import { v4 } from "uuid";
import { getDownloadURL } from "firebase/storage";
import { DATABASE_REF, STORAGE_REF } from "../client/firebase";
import { set } from "firebase/database";
import Popup from "../components/Popup";

interface MenuLayerProps {}

const MenuLayer: VFC<MenuLayerProps> = ({}) => {
  const view = useViewControl();
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [_, setSelectedId] = useRecoilState(SelectedElementIdState);

  const handleReady = () => {
    setReady(true);
    setSelectedId(null);
    view.setScale(1);
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setProcessing(true);
    const elementsRoot = document.getElementById("elements-root");
    if (elementsRoot) {
      const elementsRes = await html2canvas(elementsRoot, {
        // proxy: BASE_URL,
        width: 8000,
        height: 8000,
        backgroundColor: null,
        foreignObjectRendering: true,
        allowTaint: true,
        onclone: async (clone) => await convertAllHtmlImagesToBase64(clone),
      });
      const base64 = elementsRes.toDataURL("image/png");
      const bytes = convertBase64ToBytes(base64);

      const layer_id = v4();
      const filename = `layer_${layer_id}.png`;
      const storagePath = `/layers/${filename}`;

      console.log({ storagePath });

      await uploadImage(bytes, storagePath);
      const layer = await getDownloadURL(STORAGE_REF(storagePath));
      console.log({ layer });
      window.open(layer, "_blank");
      await set(DATABASE_REF(`/latest_submission`), {
        layer,
        name: layer_id,
        timestamp: Date.now(),
        mural: "TODO",
      });

      setProcessing(false);
      setReady(false);
    }
  };

  if (ready) {
    return (
      <Popup onToggle={() => setReady(false)}>
        {!processing && (
          <div>
            <h3>Are You Ready to Upload?</h3>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        )}
        {processing && <p>Processing...</p>}
      </Popup>
    );
  }

  return (
    <div className={styles.menuLayer}>
      <button style={{ top: 0 }} onClick={() => view.zoomIn()}>
        Zoom In
      </button>
      <button style={{ top: "30px" }} onClick={() => view.zoomOut()}>
        Zoom Out
      </button>
      {!ready && (
        <button style={{ bottom: 0, right: 0 }} onClick={handleReady}>
          Prepare for Submission
        </button>
      )}
    </div>
  );
};

export default MenuLayer;
