import { useEffect, useState, VFC } from "react";
import { formatMillisecondsToReadableTimestamp } from "../../utils";

interface Props {
  destination: number;
}

const CountdownTimer: VFC<Props> = ({ destination }) => {
  const [milliseconds, setMilliseconds] = useState(destination - Date.now());

  useEffect(() => {
    const countInterval = setInterval(() => {
      setMilliseconds(destination - Date.now());
    }, 1000);
    return () => clearInterval(countInterval);
  }, []);

  return (
    <div style={{ bottom: "40px", backgroundColor: "white", left: 0, zIndex: 500 }}>
      <h3>Open for Additions in {formatMillisecondsToReadableTimestamp(milliseconds)}</h3>
    </div>
  );
};

export default CountdownTimer;
