import { useState, VFC } from "react";
import { useRecoilState } from "recoil";
import { SelectedElementIdState } from "../data/atoms";

import MuralLayer from "../layers/MuralLayer";
import ElementsLayer from "../layers/ElementsLayer";
import MenuLayer from "../layers/MenuLayer";

import html2canvas from "html2canvas";
import { Submission } from "../types/canvas";

interface Props {
  submission: Submission;
}

const GlobalCollabView: VFC<Props> = ({ submission }) => {
  const [processing, setProcessing] = useState(false);
  const [selectedId, setSelectedId] = useRecoilState(SelectedElementIdState);

  const handleSubmit = async () => {
    setProcessing(true);
    setSelectedId(null);
    const elementsRoot = document.getElementById("elements-root");
    const muralRoot = document.getElementById("mural-root");
    if (elementsRoot && muralRoot) {
      elementsRoot.style["backgroundColor"] = "black";
      elementsRoot.style["width"] = `${window.innerWidth}px`;
      elementsRoot.style["height"] = `${window.innerHeight}px`;

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
    <div>
      <MenuLayer />
      <ElementsLayer />
      <MuralLayer mural={submission.mural} />
    </div>
  );
};

export default GlobalCollabView;
