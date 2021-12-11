import { NextPage } from "next";
import GlobalCollabView from "../views/GlobalCollabView";
import useCollage from "../hooks/useCollage";
import { HOME_TOPIC_NAME } from "../config";

const Home: NextPage = () => {
  const collage = useCollage(HOME_TOPIC_NAME);

  return <GlobalCollabView collage={collage} />;
};

export default Home;
