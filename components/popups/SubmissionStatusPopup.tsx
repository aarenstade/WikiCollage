/* eslint-disable @next/next/no-img-element */
import { VFC } from "react";
import { SubmissionStatus } from "../../types/general";
import Popup from "../Popup";

interface Props {
  status: SubmissionStatus;
  topic?: string;
}

const SubmissionStatusPopup: VFC<Props> = ({ status, topic }) => {
  if (status.success) {
    return (
      <Popup noExit onToggle={() => null}>
        <h1 style={{ fontSize: "50px", margin: "0" }}>Thank You</h1>
        <p>Your additions {topic && `to "${topic}"`} was recieved and embedded into the collage.</p>
        {status.image && <img src={status.image} alt="Collage" width="500px" />}
        {/* TODO share links */}
      </Popup>
    );
  }

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
