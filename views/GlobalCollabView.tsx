import React, { VFC } from "react";
import MuralLayer from "../components/layers/MuralLayer";
import ElementsLayer from "../components/layers/ElementsLayer";
import Navbar from "../components/page/Navbar";
import LoadingSplashView from "./LoadingSplashView";
import LoadingOverlay from "./LoadingOverlay";
import { Collage } from "../types/collage";
import { GlobalRoles } from "../types/auth";
import MenuLayerView from "../components/layers/MenuLayerView";
import MenuLayerEdit from "../components/layers/MenuLayerEdit";
import useAuth from "../hooks/useAuth";

interface Props {
  collage: Collage | null;
}

const GlobalCollabView: VFC<Props> = ({ collage }) => {
  const auth = useAuth();

  if (collage?.addition) {
    return (
      <div>
        <Navbar />
        {collage.loading && <LoadingOverlay />}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            {auth?.role === GlobalRoles.view && <MenuLayerView />}
            {auth?.role === GlobalRoles.edit && <MenuLayerEdit />}
            <ElementsLayer />
            <MuralLayer mural={!collage.loading && collage?.addition?.url} />
          </div>
        </div>
      </div>
    );
  }

  return <LoadingSplashView />;
};

export default GlobalCollabView;
