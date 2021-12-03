import React, { VFC } from "react";
import MuralLayer from "../components/layers/MuralLayer";
import ElementsLayer from "../components/layers/ElementsLayer";
import MenuLayer from "../components/layers/MenuLayer";
import Navbar from "../components/page/Navbar";
import ElementsLayerList from "../components/ElementsLayerList";
import { Collage } from "../types/collage";
import { useAuth } from "../services/AuthProvider";
import LoadingSplashView from "./LoadingSplashView";
import LoadingOverlay from "./LoadingOverlay";

interface Props {
  collage: Collage | null;
}

const GlobalCollabView: VFC<Props> = ({ collage }) => {
  const auth = useAuth();

  if (auth?.user && collage?.addition) {
    return (
      <div>
        <Navbar />
        {collage.loading && <LoadingOverlay />}
        <div style={{ display: "flex", alignItems: "center" }}>
          <ElementsLayerList />
          <div>
            <MenuLayer />
            <ElementsLayer />
            <MuralLayer mural={collage?.addition?.url} />
          </div>
        </div>
      </div>
    );
  }

  return <LoadingSplashView />;
};

export default GlobalCollabView;
