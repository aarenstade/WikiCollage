/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Canvas from "../components/Canvas";
import styles from "../styles/Home.module.css";

import { Rnd } from "react-rnd";
import { useEffect, useRef, useState } from "react";

const Home: NextPage = () => {
  const ref = useRef<any>();

  const [windowPos, setWindowPos] = useState({ x: 0, y: 0 });
  const [scaleFactor, setScaleFactor] = useState(1);

  const [gridSize, setGridSize] = useState(10000);

  const increment = 500;

  const gridImage =
    "https://firebasestorage.googleapis.com/v0/b/visual-collab.appspot.com/o/10k%20by%2010k%20grid.jpg?alt=media&token=30cc4022-1214-4a8c-bd59-2da229a22d64";

  const handleScaleUp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gridSize + increment <= 10000) setGridSize(gridSize + 500);
  };
  const handleScaleDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setGridSize(gridSize - increment);
  };

  const updateScroll = () => setWindowPos({ x: window.scrollX, y: window.scrollY });

  useEffect(() => {
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  // TODO: (from 10/24/21)

  // create view controller that handles window pos, scalefactor, and holds the base mural image, all elements, their positions, and sizes
  // above the view controller is the "TouchLayer" which is just a div
  // this TouchLayer handles click events, shows the modify popup, and can show other fixed button/layer elements

  // say we add a new draw element
  // control layer triggers new element creation
  // new element appears in Elements and automatically selected
  // the element is a canvas, scaled to user defined scale with Rnd
  // inside the canvas we have drawing functionality
  // on global scale change, we modify that elements position and width/height as any other element
  // when we save, we create a dataurl, then display it as an image

  // so rough structure

  // <div>
  //   <TouchLayer />
  //   <ViewController>
  //     <Elements />
  //   </ViewController>
  // </div>;

  return (
    <div>
      {/* <canvas ref={ref} /> */}
      <button style={{ position: "fixed", top: "0", left: "0", zIndex: 2 }} onClick={handleScaleUp}>
        + Scale
      </button>
      <button style={{ position: "fixed", top: "0", left: "50px", zIndex: 2 }} onClick={handleScaleDown}>
        - Scale
      </button>
      <div
        style={{
          width: "500px",
          height: "500px",
          backgroundColor: "red",
          position: "absolute",
          top: "5000px",
          left: "0",
          zIndex: 1,
        }}
      />
      <img
        src={gridImage}
        alt="grid"
        width={gridSize}
        height={gridSize}
        style={{ position: "absolute", top: "0", left: "0" }}
      />
    </div>
  );
};

export default Home;
