import { useState } from "react";
import { IconButton, NormalButton, SmallButton } from "../Buttons";
import HelperDialog from "../HelperDialog";
import HelpIcon from "../icons/help.svg";
import styles from "./menu.module.css";

const HelpButton = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className={styles.helpButton}>
      {showDialog && (
        <HelperDialog bottom="40px" right={0}>
          <h4>How to use:</h4>
          <ul>
            <li>Click to create an empty image.</li>
            <li>Paste URL or upload file.</li>
            <li>Double click to re-edit.</li>
          </ul>
        </HelperDialog>
      )}
      <NormalButton text="Help" icon={<HelpIcon />} onClick={() => setShowDialog(!showDialog)} />
    </div>
  );
};

export default HelpButton;
