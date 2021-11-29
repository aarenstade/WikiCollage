import { useEffect, useState, VFC } from "react";
import { WAIT_PERIOD } from "../../config";

import CountdownTimer from "./CountdownTimer";
import { BigButton } from "../Buttons";

interface SubmitControlAreaProps {
  timestamp?: Date;
  onClick: (e: React.MouseEvent) => void;
}

const SubmitControlArea: VFC<SubmitControlAreaProps> = ({ timestamp, onClick }) => {
  const [openTime, setOpenTime] = useState(timestamp ? new Date(timestamp).getTime() + WAIT_PERIOD : null);
  const [openForSubmissions, setOpenForSubmissions] = useState(true);

  useEffect(() => {
    if (timestamp) {
      const newOpenTime = new Date(timestamp).getTime() + WAIT_PERIOD;
      setOpenTime(newOpenTime);
      if (newOpenTime > Date.now()) {
        setOpenForSubmissions(false);
      } else {
        setOpenForSubmissions(true);
      }
    } else {
      setOpenForSubmissions(true);
    }
  }, [timestamp]);

  if (openForSubmissions) {
    return <BigButton style={{ bottom: 0, left: 0 }} onClick={onClick} text="Submit" />;
  } else {
    if (openTime) return <CountdownTimer destination={openTime} />;
    return <BigButton style={{ bottom: 0, left: 0 }} onClick={onClick} text="Submit" />;
  }
};

export default SubmitControlArea;
