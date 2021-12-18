/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/dist/client/router";
import { VFC } from "react";
import useElements from "../../hooks/useElements";
import { SubmissionStatus } from "../../types/general";
import { BigButton } from "../Buttons";
import LoadingIcon from "../LoadingIcon";
import Popup from "../Popup";

interface Props {
  status: SubmissionStatus;
  topic?: string;
}

const SubmissionStatusPopup: VFC<Props> = ({ status, topic }) => {
  const router = useRouter();
  const elements = useElements();
  if (status.success === true) {
    return (
      <Popup noExit onToggle={() => null}>
        <h3 style={{ fontSize: "50px", margin: "0" }}>Thank You</h3>
        <p>Your additions {topic && `to "${topic}"`} was recieved and embedded into the collage.</p>
        {status.image && <img src={status.image} alt="Collage" width="300px" style={{ marginBottom: "20px" }} />}
        <BigButton
          text="Done"
          onClick={() => {
            elements.clearElements();
            router.push("/");
          }}
        />
        {/* TODO share links */}
      </Popup>
    );
  }

  if (status.success === false) {
    return (
      <Popup noExit onToggle={() => null}>
        <h3 style={{ fontSize: "50px", margin: "0" }}>Uh oh.</h3>
        <p>An error occured...</p>
        {status.message && <p>{status.message}</p>}
        <BigButton
          text="Done"
          onClick={() => {
            elements.clearElements();
            router.push("/");
          }}
        />
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
            <LoadingIcon />
          )}
        </div>
      )}
    </Popup>
  );
};

export default SubmissionStatusPopup;
