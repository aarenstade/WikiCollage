/* eslint-disable @next/next/no-img-element */
import React, { useState, VFC } from "react";
import styles from "../styles/layers.module.css";
import useViewControl from "../hooks/useViewControl";
import { useRecoilState, useRecoilValue } from "recoil";
import { ElementListState, SelectedElementIdState } from "../data/atoms";
import html2canvas from "html2canvas";
import { convertAllHtmlImagesToBase64, convertBase64ToBytes, uploadImage } from "../image-utils";
import { v4 } from "uuid";
import { getDownloadURL } from "firebase/storage";
import { DATABASE_REF, STORAGE_REF } from "../client/firebase";
import { set } from "firebase/database";
import Popup from "../components/Popup";
import axios from "axios";
import { BASE_URL } from "../config";

interface ElementToEmbed {
  uri: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface MenuLayerProps {}

const MenuLayer: VFC<MenuLayerProps> = ({}) => {
  const view = useViewControl();
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [elementPreview, setElementPreview] = useState("");
  const [finalMural, setFinalMural] = useState("");
  const [message, setMessage] = useState("");
  const [_, setSelectedId] = useRecoilState(SelectedElementIdState);

  const elementsList = useRecoilValue(ElementListState);

  const handleReady = () => {
    setReady(true);
    setSelectedId(null);
    view.setScale(1);
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    // upload and assemble element list to merge with previous mural
    const elementObjects: ElementToEmbed[] = [];

    for (let i = 0; i < elementsList.length; i++) {
      const element = elementsList[i];
      const elementRoot = document.getElementById(`canvas-element-${i}`);
      if (elementRoot) {
        setMessage(`Handling Element ${i + 1}/${elementsList.length}...`);

        const p = elementRoot.getElementsByTagName("p");
        if (p[0]) p[0].style.transform = `translateY(-${element.textParams?.fontSize}px)`;

        const elementCanvas = await html2canvas(elementRoot, {
          backgroundColor: null,
          scale: 1,
          width: element.width,
          height: element.height,
          windowWidth: element.width,
          windowHeight: element.height,
          onclone: async (clone) => await convertAllHtmlImagesToBase64(clone),
        });
        const base64 = elementCanvas.toDataURL("image/png", 0.8);
        const bytes = convertBase64ToBytes(base64);
        setElementPreview(base64);

        // upload element content data
        setMessage(`Uploading Element ${i + 1}/${elementsList.length}...`);
        const elementId = v4();
        const storagePath = `/tmp/${elementId}.jpg`;
        await uploadImage(bytes, storagePath);
        const uri = await getDownloadURL(STORAGE_REF(storagePath));

        // append to objects
        elementObjects.push({
          uri,
          x: element.x,
          y: element.y,
          width: element.width,
          height: element.height,
        });
      }
    }

    setMessage(`Merging With Mural...`);
    // send objects to merge-mural
    const muralRes = await axios({
      url: `${BASE_URL}/api/merge-mural`,
      method: "POST",
      data: { elements: elementObjects },
    });

    const muralPath = muralRes.data;
    const newMuralUri = await getDownloadURL(STORAGE_REF(muralPath));

    await set(DATABASE_REF(`/latest_submission`), {
      name: `${v4()}`,
      timestamp: Date.now(),
      mural: newMuralUri,
    });

    setFinalMural(newMuralUri);
    setSuccess(true);
    setProcessing(false);
    setReady(false);
    // TODO show new mural in dedicated page with social links and sharability
  };

  if (success) {
    return (
      <Popup onToggle={() => setSuccess(!success)}>
        <h3>Success - Mural Merged!</h3>
        <div style={{ backgroundColor: "black" }}>
          <img src={finalMural} alt="Mural" width="300px" height="auto" />
        </div>
      </Popup>
    );
  }

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
        {message && <p>{message}</p>}
        {elementPreview && <img src={elementPreview} alt="element" width="300px" height="auto" />}
      </Popup>
    );
  }

  return (
    <div className={styles.menuLayer}>
      <p style={{ backgroundColor: "white", fontSize: "12px", top: "50px", left: 0 }}>
        Scale: {Math.round(view.view.scale * 100) / 100}
      </p>
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
