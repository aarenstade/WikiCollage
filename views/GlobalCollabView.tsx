import React, { VFC } from "react";

import MuralLayer from "../layers/MuralLayer";
import ElementsLayer from "../layers/ElementsLayer";
import MenuLayer from "../layers/MenuLayer";
import { Submission } from "../types/canvas";

interface Props {
  submission: Submission;
}

const GlobalCollabView: VFC<Props> = ({ submission }) => {
  return (
    <div>
      <MenuLayer />
      <ElementsLayer />
      <MuralLayer mural={submission.mural} />
    </div>
  );
};

export default GlobalCollabView;
