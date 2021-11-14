import { VFC } from "react";
import styles from "../styles/Home.module.css";
import GlobalCollabView from "../views/GlobalCollabView";
import { useAuth } from "../services/AuthProvider";
import { AdditionItem } from "../types/schemas";

interface HomeProps {
  addition?: AdditionItem;
}

const Home: VFC<HomeProps> = ({ addition }) => {
  const auth = useAuth();

  return (
    <div className={styles.container}>
      {addition && auth?.user ? <GlobalCollabView addition={addition} /> : <p>Loading...</p>}
    </div>
  );
};

export default Home;
