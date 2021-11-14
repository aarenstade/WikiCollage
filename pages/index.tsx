import { useEffect, useState, VFC } from "react";
import { useAuth } from "../services/AuthProvider";
import { AdditionItem } from "../types/schemas";
import { fetchAdditions } from "../services/fetch";

import GlobalCollabView from "../views/GlobalCollabView";
import styles from "../styles/Home.module.css";

import { WIKI_COLLAGE_HOME_TOPIC_ID } from "../config";

interface HomeProps {
  addition?: AdditionItem;
}

const Home: VFC<HomeProps> = () => {
  const auth = useAuth();
  const [addition, setAddition] = useState<AdditionItem | null>(null);

  useEffect(() => {
    if (auth?.token) {
      fetchAdditions(auth.token, WIKI_COLLAGE_HOME_TOPIC_ID)
        .then((res) => {
          console.log({ res });
          if (res.data) setAddition(res.data);
        })
        .catch((err) => console.error({ err }));
    }
  }, [auth?.token]);

  return (
    <div className={styles.container}>
      {addition && auth?.user ? <GlobalCollabView addition={addition} /> : <p>Loading...</p>}
    </div>
  );
};

export default Home;
