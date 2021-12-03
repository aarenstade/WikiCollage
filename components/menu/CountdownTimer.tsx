import { useEffect, useState, VFC } from "react";
import { formatMillisecondsToReadableTimestamp } from "../../utils/utils";

import styles from "./menu.module.css";

interface Props {
  destination: number;
  onTimerComplete: () => void;
}

const CountdownTimer: VFC<Props> = ({ destination, onTimerComplete }) => {
  const [milliseconds, setMilliseconds] = useState(destination - Date.now());

  useEffect(() => {
    const countInterval = setInterval(() => {
      const now = Date.now();
      if (destination > now) {
        setMilliseconds(destination - now);
      } else {
        setMilliseconds(0);
        onTimerComplete();
      }
    }, 1000);
    return () => clearInterval(countInterval);
  }, []);

  return (
    <div className={styles.countdownTimer}>
      <h3>Open for additions in {formatMillisecondsToReadableTimestamp(milliseconds)}</h3>
    </div>
  );
};

export default CountdownTimer;
