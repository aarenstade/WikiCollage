import { FC } from "react";
import styles from "./Popup.module.css";

interface PopupProps {
  noExit?: boolean;
  onToggle: () => void;
}

const Popup: FC<PopupProps> = ({ noExit, onToggle, children }) => {
  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        {!noExit && (
          <span className={styles.close} onClick={onToggle}>
            &times;
          </span>
        )}
        {children}
      </div>
    </div>
  );
};

export default Popup;
