import React, { useState, VFC } from "react";
import { useRecoilState } from "recoil";
import { SelectedElementIdState } from "../data/atoms";

import MuralLayer from "../layers/MuralLayer";
import ElementsLayer from "../layers/ElementsLayer";
import MenuLayer from "../layers/MenuLayer";

import html2canvas from "html2canvas";
import { Submission } from "../types/canvas";
import useViewControl from "../hooks/useViewControl";

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
