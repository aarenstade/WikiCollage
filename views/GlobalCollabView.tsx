import React, { VFC } from "react";
import MuralLayer from "../layers/MuralLayer";
import ElementsLayer from "../layers/ElementsLayer";
import MenuLayer from "../layers/MenuLayer";
import { AdditionItem } from "../types/schemas";
import Navbar from "../components/page/Navbar";

interface Props {
  addition: AdditionItem | null;
}

const GlobalCollabView: VFC<Props> = ({ addition }) => {
  return (
    <div>
      <Navbar />
      <div>
        <MenuLayer />
        <ElementsLayer />
        <MuralLayer mural={addition?.url} />
      </div>
    </div>
  );
};

export default GlobalCollabView;
