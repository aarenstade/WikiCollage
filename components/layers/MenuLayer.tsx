import React, { useState } from "react";
import styles from "../../styles/layers.module.css";
import ScaleSlider from "../menu/ScaleSlider";
import SubmitControlArea from "../menu/SubmitControlArea";
import useCollage from "../../hooks/useCollage";
import useSubmitHandler from "../../hooks/useSubmitHandler";
import SubmissionFormPopup from "../popups/SubmissionFormPopup";
import { AdditionSubmitFormValues } from "../../types/general";
import SubmissionStatusPopup from "../popups/SubmissionStatusPopup";

const MenuLayer = () => {
  const collage = useCollage();
  const submit = useSubmitHandler();

  const [formValues, setFormValues] = useState<AdditionSubmitFormValues>({ creator: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit.handleSubmission(formValues);
  };

  if (submit.status.ready && !submit.status.processing) {
    return (
      <SubmissionFormPopup
        values={formValues}
        setFormValues={(v) => setFormValues(v)}
        onClose={() => submit.setStatus({ ...submit.status, ready: false })}
        onSubmit={handleSubmit}
      />
    );
  }

  if (submit.status.ready && submit.status.processing) {
    return <SubmissionStatusPopup status={submit.status} />;
  }

  return (
    <div className={styles.menuLayer}>
      <ScaleSlider />
      <SubmitControlArea timestamp={collage.addition?.timestamp} onClick={() => submit.validateSubmission()} />
    </div>
  );
};

export default MenuLayer;
