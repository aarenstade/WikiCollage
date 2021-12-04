import { FormEvent, VFC } from "react";
import { BigButton } from "../Buttons";
import Popup from "../Popup";
import container from "../../styles/containers.module.css";
import { AdditionSubmitFormValues } from "../../types/general";

interface Props {
  values: AdditionSubmitFormValues;
  setFormValues: (v: AdditionSubmitFormValues) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
}

const SubmissionFormPopup: VFC<Props> = ({ values, setFormValues, onClose, onSubmit }) => {
  return (
    <Popup onToggle={() => onClose()}>
      <div>
        <h2>Upload Your Additions</h2>
        <form onSubmit={onSubmit} style={{ gap: "20px" }} className={container.simpleColumnContainer}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            onChange={(e) => setFormValues({ ...values, name: e.target.value })}
          />
          <input
            type="text"
            name="email"
            placeholder="Your Email (optional, for updates, never made public)"
            onChange={(e) => setFormValues({ ...values, email: e.target.value })}
          />
          <textarea
            name="description"
            placeholder="Describe what you added... (optional)"
            style={{ width: "90%", height: "100px" }}
            onChange={(e) => setFormValues({ ...values, description: e.target.value })}
          />
          <BigButton submit onClick={() => null} text="Submit" />
        </form>
      </div>
    </Popup>
  );
};

export default SubmissionFormPopup;
