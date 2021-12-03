/* eslint-disable @next/next/no-img-element */
import { VFC } from "react";
import { SubmissionStatus } from "../../types/general";
import Popup from "../Popup";

interface Props {
  status: SubmissionStatus;
}

const SubmissionStatusPopup: VFC<Props> = ({ status }) => {
  return (
    <Popup noExit onToggle={() => null}>
      {status.processing && status.message && <p>{status.message}</p>}
      {status.processing && (
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {status.image ? (
            <img src={status.image} alt="element" width="300px" height="auto" />
          ) : (
            //   TODO cool loading icon
            <div style={{ backgroundColor: "lightgray", width: "300px", height: "300px" }} />
          )}
        </div>
      )}
    </Popup>
  );
};

export default SubmissionStatusPopup;
