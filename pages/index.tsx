import { VFC } from "react";
import { useAuth } from "../services/AuthProvider";
import { AdditionItem } from "../types/schemas";

import GlobalCollabView from "../views/GlobalCollabView";
import styles from "../styles/Home.module.css";

import useCollage from "../hooks/useCollage";
import { HOME_TOPIC_NAME } from "../config";

interface HomeProps {
  addition?: AdditionItem;
}

const Home: VFC<HomeProps> = () => {
  const auth = useAuth();
  const collage = useCollage(HOME_TOPIC_NAME);

  return (
    <div className={styles.container}>
      {collage.addition && auth?.user ? <GlobalCollabView addition={collage.addition} /> : <p>Loading...</p>}
    </div>
  );
};

export default Home;
