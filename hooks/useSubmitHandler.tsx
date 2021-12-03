import { useState } from "react";
import { useRecoilState } from "recoil";
import { SelectedElementIdState } from "../data/atoms";
import { useAuth } from "../services/AuthProvider";
import { ElementToEmbed } from "../types/elements";
import { AdditionSubmitFormValues, SubmissionStatus } from "../types/general";
import { AdditionItem } from "../types/mongodb/schemas";
import { buildImageFromElement, embedNewMural, insertNewAddition } from "../upload";
import { convertBase64ToBytes, uploadImage } from "../utils/image-utils";
import useCollage from "./useCollage";
import useElements from "./useElements";
import useViewControl from "./useViewControl";

interface SubmitHandlerHook {
  status: SubmissionStatus;
  setStatus: (s: SubmissionStatus) => void;
  validateSubmission: () => void;
  handleSubmission: (data: AdditionSubmitFormValues) => Promise<void>;
}

const useSubmitHandler = (): SubmitHandlerHook => {
  const auth = useAuth();
  const collage = useCollage();
  const elements = useElements();
  const view = useViewControl();
  const [_, setSelectedId] = useRecoilState(SelectedElementIdState);

  const [status, setStatus] = useState<SubmissionStatus>({
    ready: false,
    processing: false,
    success: false,
    message: "",
    image: "",
  });

  const validateSubmission = () => {
    if (elements.elements.length > 0) {
      view.setScale(1);
      setSelectedId(null);
      setStatus({ ...status, ready: true });
    } else {
      alert("No Elements Added... Click Anywhere to Add an Element");
    }
  };

  const handleSubmission = async (form: AdditionSubmitFormValues) => {
    try {
      if (auth?.token) {
        setStatus({ ...status, processing: true, message: "Preparing..." });

        const elementsList = [...elements.elements];
        let elementObjects: ElementToEmbed[] = [];

        for (let i = 0; i < elementsList.length; i++) {
          const base64 = await buildImageFromElement(elementsList[i]);
          if (base64) {
            setStatus({ ...status, message: `Processing Element ${i + 1} of ${elementsList.length}`, image: base64 });
            const bytes = convertBase64ToBytes(base64);
            const uri = await uploadImage(bytes, `tmp/${elementsList[i].html_id}.png`);
            if (uri) {
              const { x, y, width, height } = elementsList[i];
              elementObjects.push({ uri, x, y, width, height });
            }
          }
        }

        if (elementObjects.length > 0) {
          setStatus({ ...status, message: "Embedding..." });
          const mural = await embedNewMural(auth.token, elementObjects, collage.addition?.url);
          if (mural) {
            setStatus({ ...status, message: "Processing...", image: mural });
            let newAddition: AdditionItem = {
              topic_id: collage.topic?._id,
              url: mural,
              creator: form.creator,
              description: form.description,
              timestamp: new Date(),
            };
            const addition = await insertNewAddition(auth.token, newAddition, collage.topic);
            if (addition._id) {
              setStatus({ ...status, message: "Success!", success: true });
              // TODO show success dialog
            } else {
              setStatus({ ...status, message: "Error!", processing: false });
              // TODO better error handling and UI response
            }
          }
        } else {
          setStatus({ ...status, message: "Error processing elements...", image: "" });
        }
      }
    } catch (error) {
      setStatus({ ...status, message: `Uh oh... an error occurred: ${error}`, image: "" });
      // TODO reset upload dialogs
    }
  };

  return { status, setStatus, validateSubmission, handleSubmission };
};

export default useSubmitHandler;
