import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DATABASE_REF } from "../client/firebase";
import { get } from "firebase/database";
import Canvas from "../components/Canvas";
import styles from "../styles/Home.module.css";
import GlobalCollabView from "../views/GlobalCollabView";

const Home: NextPage = () => {
  const [latestSubmission, setLatestSubmission] = useState(null);

  useEffect(() => {
    get(DATABASE_REF(`/latest_submission/`))
      .then((res) => res.exists() && setLatestSubmission(res.val()))
      .catch((err) => console.log(err));
  }, []);

  return <div className={styles.container}>{latestSubmission ? <GlobalCollabView /> : <p>Loading...</p>}</div>;
};

export default Home;
