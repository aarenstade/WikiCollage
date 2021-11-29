import { useEffect, useState, VFC } from "react";
import { WAIT_PERIOD } from "../../config";

import CountdownTimer from "./CountdownTimer";
import { BigButton } from "../Buttons";
import { isTopicOpen } from "../../utils";

interface SubmitControlAreaProps {
  timestamp?: Date;
  onClick: (e: React.MouseEvent) => void;
}

const SubmitControlArea: VFC<SubmitControlAreaProps> = ({ timestamp, onClick }) => {
  const [openTime, setOpenTime] = useState(timestamp ? new Date(timestamp).getTime() + WAIT_PERIOD : null);
  const [openForSubmissions, setOpenForSubmissions] = useState(true);

  const submitButtonStyle = { bottom: 0, left: 0, margin: "10px" };

  useEffect(() => {
    const { isOpen, openTime } = isTopicOpen(timestamp && new Date(timestamp).getTime());
    setOpenForSubmissions(isOpen);
    openTime && setOpenTime(openTime);
  }, [timestamp]);

  if (openForSubmissions) {
    return <BigButton style={submitButtonStyle} onClick={onClick} text="Submit Additions" />;
  } else {
    if (openTime) return <CountdownTimer destination={openTime} onTimerComplete={() => setOpenForSubmissions(true)} />;
    return <BigButton style={submitButtonStyle} onClick={onClick} text="Submit Additions" />;
  }
};

export default SubmitControlArea;
