import { uploadImage } from "../utils/image-utils";
import { createFullAdditionsImage, insertNewAddition, mergeNewCollage } from "../upload";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { SelectedElementIdState } from "../data/atoms";
import { AdditionSubmitFormValues } from "../types/general";
import { AdditionItem } from "../types/mongodb/schemas";
import useAuth from "./useAuth";
import useCollage from "./useCollage";
import useElements from "./useElements";
import useViewControl from "./useViewControl";
import { getDownloadURL } from "firebase/storage";
import { STORAGE_REF } from "../client/firebase";
import { v4 } from "uuid";

interface SubmitHandlerHook {
  message: string;
  liveImage: string;
  success?: boolean;
  validateSubmission: () => boolean;
  handleSubmission: (data: AdditionSubmitFormValues) => Promise<void>;
}

const useSubmitHandler = (): SubmitHandlerHook => {
  const auth = useAuth();
  const collage = useCollage();
  const elements = useElements();
  const view = useViewControl();
  const [_, setSelectedId] = useRecoilState(SelectedElementIdState);

  const [message, setMessage] = useState<string>("");
  const [liveImage, setLiveImage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>();

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
        setMessage("Handling Images...");
        const additionsImage = await createFullAdditionsImage();
        if (!additionsImage) throw new Error("Failed to compile additions...");

        setMessage("Merging Additions...");
        const additionUrl = await uploadImage(additionsImage, `/tmp/${v4()}.png`);
        if (!additionUrl) throw new Error("Additions failed to upload...");

        // embed new collage
        const merge = await mergeNewCollage(additionUrl, collage.addition?.url);
        if (!merge?.storagePath) throw new Error("Error merging additions...");

        setMessage("Finalizing...");
        const newCollage = await getDownloadURL(STORAGE_REF(merge.storagePath));
        let newAddition: AdditionItem = {
          topic_id: collage.topic?._id,
          url: newCollage,
          name: form.name,
          email: form.email,
          description: form.description,
          address: auth.eth.account || undefined,
          timestamp: new Date(),
        };

        const addition = await insertNewAddition(auth.firebase.token, newAddition, collage.topic);
        if (!addition._id) throw new Error("Addition failed to insert...");

        setLiveImage(newCollage);
        setSuccess(true);
        setMessage("Success!");
      }
    } catch (error) {
      if (typeof error === "string") setMessage(error);
      console.error({ error });
      setSuccess(false);
    }
  };

  return { message, liveImage, success, validateSubmission, handleSubmission };
};

export default useSubmitHandler;
