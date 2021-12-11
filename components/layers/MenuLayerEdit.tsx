import React, { useState } from "react";
import styles from "../../styles/layers.module.css";
import ScaleSlider from "../menu/ScaleSlider";
import SubmitControlArea from "../menu/SubmitControlArea";
import useCollage from "../../hooks/useCollage";
import useSubmitHandler from "../../hooks/useSubmitHandler";
import SubmissionFormPopup from "../popups/SubmissionFormPopup";
import { AdditionSubmitFormValues } from "../../types/general";
import SubmissionStatusPopup from "../popups/SubmissionStatusPopup";
import ElementsLayerList from "../menu/ElementsLayerList";
import HelpButton from "../menu/HelpButton";

const MenuLayerEdit = () => {
  const collage = useCollage();
  const submit = useSubmitHandler();

  const [submitReady, setSubmitReady] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [formValues, setFormValues] = useState<AdditionSubmitFormValues>({ name: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit.handleSubmission(formValues);
  };

  if (submitReady && !processing) {
    return (
      <SubmissionFormPopup
        values={formValues}
        setFormValues={(v) => setFormValues(v)}
        onClose={() => setSubmitReady(false)}
        onSubmit={(e) => {
          setProcessing(true);
          handleSubmit(e);
        }}
      />
    );
  }

  if (submitReady && processing) {
    return (
      <SubmissionStatusPopup
        status={{
          processing,
          ready: submitReady,
          image: submit.liveImage,
          message: submit.message,
          success: submit.success,
        }}
        topic={collage.topic?.topic}
      />
    );
  }

  return (
    <div className={styles.menuLayer}>
      <ElementsLayerList />
      <ScaleSlider />
      <SubmitControlArea
        timestamp={collage.addition?.timestamp}
        onClick={() => {
          const validation = submit.validateSubmission();
          setSubmitReady(validation);
        }}
      />
      <HelpButton />
    </div>
  );
};

export default MenuLayerEdit;
