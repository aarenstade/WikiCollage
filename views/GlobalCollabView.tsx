import React, { VFC } from "react";
import MuralLayer from "../components/layers/MuralLayer";
import ElementsLayer from "../components/layers/ElementsLayer";
import LoadingSplashView from "./LoadingSplashView";
import LoadingOverlay from "./LoadingOverlay";
import { Collage } from "../types/collage";
import { GlobalRoles } from "../types/auth";
import MenuLayerView from "../components/layers/MenuLayerView";
import MenuLayerEdit from "../components/layers/MenuLayerEdit";
import useAuth from "../hooks/useAuth";
import HelperDialog from "../components/HelperDialog";

interface Props {
  collage: Collage | null;
}

const GlobalCollabView: VFC<Props> = ({ collage }) => {
  const auth = useAuth();

  if (collage?.addition) {
    return (
      <div>
        {collage.loading && <LoadingOverlay />}
        {!collage.loading && !collage.addition.url && (
          <HelperDialog top="var(--navbar-offset)" right={0}>
            <h3>New Topic!</h3>
            <p>{`You're the first here, make a meaningful contribution!`}</p>
          </HelperDialog>
        )}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            {auth?.role === GlobalRoles.view || collage.topic?.locked ? <MenuLayerView /> : <MenuLayerEdit />}
            {!collage.topic?.locked && <ElementsLayer />}
            <MuralLayer mural={!collage.loading ? collage?.addition?.url : undefined} />
          </div>
        </div>
      </div>
    );
  }

  return <LoadingSplashView />;
};

export default GlobalCollabView;
