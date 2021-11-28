import { VFC } from "react";
import { AdditionItem } from "../types/schemas";

import GlobalCollabView from "../views/GlobalCollabView";

import useCollage from "../hooks/useCollage";
import { HOME_TOPIC_NAME } from "../config";

interface HomeProps {
  addition?: AdditionItem;
}

const Home: VFC<HomeProps> = () => {
  const collage = useCollage(HOME_TOPIC_NAME);

  return <GlobalCollabView collage={collage} />;
};

export default Home;
