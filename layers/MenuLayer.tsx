import React, { useState, VFC } from "react";
import styles from "../styles/layers.module.css";
import useViewControl from "../services/ViewControl";
import { useRecoilState } from "recoil";
import { SelectedElementIdState } from "../data/atoms";
import html2canvas from "html2canvas";

//shows tooltip dialogs

interface MenuLayerProps {}

const MenuLayer: VFC<MenuLayerProps> = ({}) => {
  const view = useViewControl();
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [selectedId, setSelectedId] = useRecoilState(SelectedElementIdState);

  const handleReady = () => {
    setReady(true);
    // view.setScale(1);
    setSelectedId(null);
  };

  // TODO: cant create single layer image of 10,000 x 10,000 (exceeded browser canvas size support)
  // need way to break html element up, or just export at lower resolution and upscale?

  // options:
  // RENDER SERVERSIDE - send html node to api endpoint and render serverside?
  // UPSCALE - export at lower resolution and upscale?
  // CHANGE DEFAULT SIZE - change default mural size to something better supported by all browsers
  // CUT AND REASSEMBLE - break html element up into smaller sections (hard)

  // TODO: setup serverside endpoint to recieve html node
  // see if we can render html2canvas serverside

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setProcessing(true);
    const elementsRoot = document.getElementById("elements-root");
    if (elementsRoot) {
      console.log(`width: ${elementsRoot.style["width"]}`);
      console.log(`height: ${elementsRoot.style["height"]}`);
      // elementsRoot.style["backgroundColor"] = "black";

      const elementsRes = await html2canvas(elementsRoot, { width: 10000, height: 10000 });
      const elements = elementsRes.toDataURL("image/png");
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
      {ready && (
        <button style={{ bottom: 0, right: 0 }} onClick={handleSubmit}>
          {processing ? "..." : "Submit"}
        </button>
      )}
    </div>
  );
};

export default MenuLayer;
