import React, { VFC } from "react";
import MuralLayer from "../layers/MuralLayer";
import ElementsLayer from "../layers/ElementsLayer";
import MenuLayer from "../layers/MenuLayer";
import { AdditionItem } from "../types/schemas";

interface Props {
  addition: AdditionItem | null;
}

const GlobalCollabView: VFC<Props> = ({ addition }) => {
  return (
    <div>
      <MenuLayer />
      <ElementsLayer />
      <MuralLayer mural={addition?.url} />
    </div>
  );
};

export default GlobalCollabView;
