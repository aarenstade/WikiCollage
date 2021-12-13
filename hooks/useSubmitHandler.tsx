import html2canvas from "html2canvas";
import { convertAllHtmlImagesToBase64, convertBase64ToBytes, uploadImage } from "../utils/image-utils";
import { embedNewCollage, insertNewAddition } from "../upload";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { SelectedElementIdState } from "../data/atoms";
import { AdditionSubmitFormValues } from "../types/general";
import { AdditionItem } from "../types/mongodb/schemas";
import useAuth from "./useAuth";
import useCollage from "./useCollage";
import useElements from "./useElements";
import useViewControl from "./useViewControl";
import { MURAL_DIMENSION } from "../config";
import { v4 } from "uuid";
import { getDownloadURL } from "firebase/storage";
import { STORAGE_REF } from "../client/firebase";

interface SubmitHandlerHook {
  message: string;
  liveImage: string;
  success: boolean;
  validateSubmission: () => boolean;
  handleSubmission: (data: AdditionSubmitFormValues) => Promise<void>;
}

const useSubmitHandler = (): SubmitHandlerHook => {
  const auth = useAuth();
  const collage = useCollage();
  const elements = useElements();
  const view = useViewControl();
  const [_, setSelectedId] = useRecoilState(SelectedElementIdState);

  const [message, setMessage] = useState("");
  const [liveImage, setLiveImage] = useState("");
  const [success, setSuccess] = useState(false);

  const validateSubmission = (): boolean => {
    if (elements.elements.length > 0) {
      view.setScale(1);
      setSelectedId(null);
      return true;
    } else {
      alert("Click Anywhere to Add an Element");
      return false;
    }
  };

  const handleSubmission = async (form: AdditionSubmitFormValues) => {
    try {
      if (auth?.firebase?.token) {
        setMessage("Preparing...");
        const root = document.getElementById("elements-root");
        if (root) {
          setMessage("Handling Images...");
          const canvas = await html2canvas(root, {
            backgroundColor: null,
            scale: 1,
            width: MURAL_DIMENSION,
            height: MURAL_DIMENSION,
            onclone: async (clone) => convertAllHtmlImagesToBase64(clone),
          });

          const base64 = canvas.toDataURL("image/png");
          const bytes = convertBase64ToBytes(base64);
          setMessage("Merging Additions...");

          const path = `/tmp/${v4()}.png`;
          await uploadImage(bytes, path);
          const additionsUrl = await getDownloadURL(STORAGE_REF(path));
          console.log({ additionsUrl });

          if (additionsUrl) {
            const newCollage = await embedNewCollage(additionsUrl, collage.addition?.url);
            if (newCollage) {
              let newAddition: AdditionItem = {
                topic_id: collage.topic?._id,
                url: newCollage.url,
                name: form.name,
                email: form.email,
                description: form.description,
                address: auth.eth.account || undefined,
                timestamp: new Date(),
              };
              const addition = await insertNewAddition(auth.firebase.token, newAddition, collage.topic);
              if (addition._id) {
                setLiveImage(newCollage.url);
                setSuccess(true);
                setMessage("Success!");
              }
            } else {
              console.log("collage not created...");
              // TODO better error handling
            }
          }
        }
      }
    } catch (error) {
      console.error({ error });
    }
  };

  return { message, liveImage, success, validateSubmission, handleSubmission };
};

export default useSubmitHandler;
