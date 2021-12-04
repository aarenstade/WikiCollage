import { useEffect, useState, VFC } from "react";
import { WAIT_PERIOD } from "../../config";

import CountdownTimer from "./CountdownTimer";
import { BigButton } from "../Buttons";
import { isTopicOpen } from "../../utils/utils";

interface SubmitControlAreaProps {
  timestamp?: Date;
  onClick: (e: React.MouseEvent) => void;
}

const SubmitControlArea: VFC<SubmitControlAreaProps> = ({ timestamp, onClick }) => {
  const [openTime, setOpenTime] = useState(timestamp ? new Date(timestamp).getTime() + WAIT_PERIOD : null);
  const [openForSubmissions, setOpenForSubmissions] = useState(true);

  useEffect(() => {
    const { isOpen, openTime } = isTopicOpen(timestamp && new Date(timestamp).getTime());
    setOpenForSubmissions(isOpen);
    openTime && setOpenTime(openTime);
  }, [timestamp]);

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, margin: "10px" }}>
      {openForSubmissions ? (
        <BigButton onClick={onClick} text="Submit Additions" />
      ) : openTime ? (
        <CountdownTimer destination={openTime} onTimerComplete={() => setOpenForSubmissions(true)} />
      ) : (
        <BigButton onClick={onClick} text="Submit Additions" />
      )}
    </div>
  );
};

export default SubmitControlArea;
