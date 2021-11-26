/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import useViewControl from "../hooks/useViewControl";
import { useRecoilState, useRecoilValue } from "recoil";
import { CollageState, ElementListState, SelectedElementIdState } from "../data/atoms";
import { ElementToEmbed } from "../types/elements";
import { AdditionItem } from "../types/schemas";
import { useAuth } from "../services/AuthProvider";
import { useRouter } from "next/dist/client/router";
import { UploadStatus } from "../types/general";
import { convertBase64ToBytes, uploadImage } from "../image-utils";
import { buildImageFromElement, embedNewMural, insertNewAddition } from "../upload";

import Popup from "../components/Popup";
import styles from "../styles/layers.module.css";

import container from "../styles/containers.module.css";

const MenuLayer = () => {
  const auth = useAuth();
  const router = useRouter();
  const view = useViewControl();
  const collage = useRecoilValue(CollageState);
  const [_, setSelectedId] = useRecoilState(SelectedElementIdState);

  const [creator, setCreator] = useState("");
  const [description, setDescription] = useState("");

  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ message: "Starting Upload..." });

  const elementsList = useRecoilValue(ElementListState);

  const handleReady = () => {
    setReady(true);
    setSelectedId(null);
    view.setScale(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (auth?.token) {
        console.log("starting upload...");
        setProcessing(true);
        setUploadStatus({ message: "Starting Upload..." });

        let elementObjects: ElementToEmbed[] = [];

        console.log({ elementsList });

        for (let i = 0; i < elementsList.length; i++) {
          console.log(`element ${i}`);
          const base64 = await buildImageFromElement(elementsList[i]);
          console.log(`has base64?: ${base64 != null}`);
          if (base64) {
            setUploadStatus({ message: `Processing Element ${i} of ${elementsList.length}...`, image: base64 });
            const bytes = convertBase64ToBytes(base64);
            console.log("uploading image");
            const uri = await uploadImage(bytes, `tmp/${elementsList[i].html_id}.png`);
            if (uri) {
              const { x, y, width, height } = elementsList[i];
              elementObjects.push({ uri, x, y, width, height });
            }
          }
        }

        if (elementObjects.length > 0) {
          console.log("starting embed");
          setUploadStatus({ message: "Embedding..." });
          const mural = await embedNewMural(auth.token, elementObjects, collage.addition?.url);
          console.log({ mural });
          if (mural) {
            setUploadStatus({ message: "Processing...", image: mural });

            let newAddition: AdditionItem = {
              topic_id: collage.topic?._id,
              url: mural,
              creator,
              description,
              timestamp: new Date(),
            };
            const addition = await insertNewAddition(auth.token, newAddition, collage.topic);
            console.log({ addition });
            if (addition._id) {
              setUploadStatus({ ...uploadStatus, message: "Success!" });
              setProcessing(false);
              router.push(`/success?topic=${collage.topic?.topic}`);
            } else {
              setUploadStatus({ ...uploadStatus, message: "Error!" });
              setProcessing(false);
              // TODO better error handling and UI response
            }
          }
        } else {
          setUploadStatus({ message: "Error processing elements...", image: "" });
        }
      }
    } catch (error) {
      setUploadStatus({ message: `Uh oh... an error occurred: ${error}`, image: "" });
      console.log("SUBMIT ERROR");

      console.error({ error });
      // TODO reset upload dialogs
    }
  };

  if (ready) {
    return (
      <Popup noExit={processing} onToggle={() => setReady(false)}>
        {!processing && (
          <div>
            <h3>Upload Your Additions</h3>
            <form
              onSubmit={handleSubmit}
              style={{ width: "100%", gap: "20px" }}
              className={container.simpleColumnContainer}
            >
              <input
                type="text"
                name="creator"
                placeholder="Your Name"
                required
                onChange={(e) => setCreator(e.target.value)}
              />
              <textarea
                name="description"
                placeholder="Describe what you added..."
                onChange={(e) => setDescription(e.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
        {processing && <p>Processing...</p>}
        {processing && <p>{uploadStatus.message}</p>}
        {processing && uploadStatus.image && <img src={uploadStatus.image} alt="element" width="300px" height="auto" />}
      </Popup>
    );
  }

  return (
    <div className={styles.menuLayer}>
      <p style={{ backgroundColor: "white", fontSize: "12px", top: "var(--navbar-offset)", left: 0 }}>
        Scale: {Math.round(view.view.scale * 100) / 100}
      </p>
      <button style={{ top: "calc(var(--navbar-offset) + 20px)" }} onClick={() => view.zoomIn()}>
        Zoom In
      </button>
      <button style={{ top: "calc(var(--navbar-offset) + 50px)" }} onClick={() => view.zoomOut()}>
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
