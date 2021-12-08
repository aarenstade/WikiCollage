import { FC, useEffect, useState } from "react";
import styles from "./HelperDialog.module.css";

interface HelperDialogProps {
  top?: number | string;
  left?: number | string;
  bottom?: number | string;
  right?: number | string;
  displayTime?: number;
}

const HelperDialog: FC<HelperDialogProps> = ({ children, top, left, bottom, right, displayTime = 2500 }) => {
  const [style, setStyle] = useState(styles.helperDialog);

  useEffect(() => {
    setTimeout(() => setStyle(styles.helperDialogHidden), displayTime);
  }, []);

  return (
    <div
      className={`${styles.helperDialogContainer} ${style}`}
      style={{
        position: "fixed",
        top,
        left,
        bottom,
        right,
        zIndex: 600,
        maxWidth: "300px",
        backgroundColor: "white",
        padding: "8px",
        borderRadius: "10px",
      }}
    >
      {children}
    </div>
  );
};

export default HelperDialog;
