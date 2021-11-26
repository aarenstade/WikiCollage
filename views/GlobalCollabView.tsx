import React, { VFC } from "react";
import MuralLayer from "../layers/MuralLayer";
import ElementsLayer from "../layers/ElementsLayer";
import MenuLayer from "../layers/MenuLayer";
import { AdditionItem } from "../types/schemas";
import Navbar from "../components/page/Navbar";
import ElementsLayerList from "../components/ElementsLayerList";

interface Props {
  addition: AdditionItem | null;
}

const GlobalCollabView: VFC<Props> = ({ addition }) => {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex", alignItems: "center" }}>
        <ElementsLayerList />
        <div>
          <MenuLayer />
          <ElementsLayer />
          <MuralLayer mural={addition?.url} />
        </div>
      </div>
    </div>
  );
};

export default GlobalCollabView;
