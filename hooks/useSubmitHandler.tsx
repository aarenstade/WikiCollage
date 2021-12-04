import { useState } from "react";
import { useRecoilState } from "recoil";
import { SelectedElementIdState } from "../data/atoms";
import { ElementToEmbed } from "../types/elements";
import { AdditionSubmitFormValues } from "../types/general";
import { AdditionItem } from "../types/mongodb/schemas";
import { embedNewMural, insertNewAddition } from "../upload";
import useAuth from "./useAuth";
import useCollage from "./useCollage";
import useElements from "./useElements";
import useViewControl from "./useViewControl";

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
      if (auth?.firebase?.token && auth?.eth.account) {
        setMessage("Preparing...");
        const elementsList = [...elements.elements];
        let elementObjects: ElementToEmbed[] = [];

        // loop through all image objects
        const imageElements = elementsList.filter((e) => e.type === "image");
        imageElements.forEach((e) => {
          const { x, y, width, height, data } = e;
          elementObjects.push({ uri: data, x, y, width, height });
        });

        // for (let i = 0; i < elementsList.length; i++) {
        //   const base64 = await buildImageFromElement(elementsList[i]);
        //   if (base64) {
        //     setStatus({ ...status, message: `Processing Element ${i + 1} of ${elementsList.length}`, image: base64 });
        //     const bytes = convertBase64ToBytes(base64);
        //     const uri = await uploadImage(bytes, `tmp/${elementsList[i].html_id}.png`);
        //     if (uri) {
        //       const { x, y, width, height } = elementsList[i];
        //       elementObjects.push({ uri, x, y, width, height });
        //     }
        //   }
        // }

        if (elementObjects.length > 0) {
          setMessage("Embedding...");
          const mural = await embedNewMural(auth.firebase.token, elementObjects, collage.addition?.url);
          if (mural) {
            setMessage("Processing");
            setLiveImage(mural);
            let newAddition: AdditionItem = {
              topic_id: collage.topic?._id,
              url: mural,
              creator: form.creator,
              description: form.description,
              timestamp: new Date(),
            };
            const addition = await insertNewAddition(auth.firebase.token, newAddition, collage.topic);
            if (addition._id) {
              setSuccess(true);
              setMessage("Success!");
            } else {
              setMessage("ERROR");
              // TODO better error handling and UI response
            }
          }
        } else {
          setMessage("Error processing elements...");
        }
      }
    } catch (error) {
      setMessage(`Uh oh... an error occurred: ${error}`);
      // TODO reset upload dialogs
    }
  };

  return { message, liveImage, success, validateSubmission, handleSubmission };
};

export default useSubmitHandler;
