import { NextPage } from "next";
import { GITHUB_URL } from "../config";

import container from "../styles/containers.module.css";

const AboutPage: NextPage = () => {
  return (
    <div className={container.pageContainer}>
      <div className={container.contentContainer}>
        <h3>About WikiCollage</h3>
        <p>WikiCollage is a simple image layout editor with an open access contribution model.</p>
        <p>Anyone can create topics and add images. Each topic starts with an empty 5000 x 5000 pixel image.</p>
        <p>The goal is to build a unique image collage for every topic, idea, or word.</p>
      </div>
      <div className={container.contentContainer}>
        <h3>Notes About Project Development</h3>

        <p>WikiCollage was started by Aaren Stade in November 2021.</p>
        <p>The values of this project are open-access and decentralized control.</p>
        <p>ASAP all code will be open sourced.</p>
        <p>
          Please report bugs to <a href="aarenstade@gmail.com">aarenstade@gmail.com</a>
        </p>
      </div>
      {/* <div className={container.contentContainer}>
        <h3>Current Development</h3>
        <p>This project is early in development and new features are continually being added.</p>
        <p>{`So far, this is where we're at:`}</p>
        <ul>
          <li>Image layout editor.</li>
          <li>Backend to fetch and store data.</li>
          <li>Process to embed new additions into topic image.</li>
          <li>Connection with Ethereum browser wallet extensions.</li>
        </ul>
      </div>
      <div className={container.contentContainer}>
        <h3>Medium-Term Development Goals</h3>
        <p>To make this project fully realized, these are some major next steps:</p>
        <ul>
          <li>
            Community
            <ul>
              <li>Grow WikiCollage community.</li>
              <li>Whitelist more trusted administrators.</li>
              <li>Better documentation and code commenting.</li>
            </ul>
          </li>
          <li>
            Automated NFT minting process.
            <ul>
              <li>Admins select developed topics and initiate NFT minting, limited by monthly maximum.</li>
              <li>
                Algo to calculate fractional ownership between contributors, admin, WC, and possibly other parties.
              </li>
              <li>Connection with OpenSea API, automated minting, notications, and social posts.</li>
            </ul>
          </li>
        </ul>
      </div> */}
      <div className={container.contentContainer}>
        <h3>Want to help?</h3>
        <p>{`Make collage additions! That's the best way to contribute.`}</p>
        {/* <p>Make sure to connect your crypto wallet in case of any future NFT sales.</p> */}
        <p>
          Join the <a href="https://discord.gg/hhtvt4qTRs">Discord</a>
        </p>
        <p>
          Or contact <a href="https://twitter.com/AarenStade">@aarenstade</a>
        </p>
      </div>
      <div className={container.contentContainer}>
        <p>© WikiCollage 2022</p>
      </div>
    </div>
    // <div className={container.pageContainer}>
    //   <div className={container.contentContainer}>
    //     <h3>About WikiCollage</h3>
    //     <p>WikiCollage is a simple image layout editor with an open access contribution model.</p>
    //     <p>Anyone can create topics and add images. Each topic starts with an empty 5000 x 5000 pixel image.</p>
    //     <p>
    //       The goal is to build a unique image collage for every topic, idea, or word, and mint those as collectively
    //       owned NFTs.
    //     </p>
    //   </div>
    //   <div className={container.contentContainer}>
    //     <h3>Current Development</h3>
    //     <p>This project is early in development and new features are continually being added.</p>
    //     <p>{`So far, this is where we're at:`}</p>
    //     <ul>
    //       <li>Image layout editor.</li>
    //       <li>Backend to fetch and store data.</li>
    //       <li>Process to embed new additions into topic image.</li>
    //       <li>Connection with Ethereum browser wallet extensions.</li>
    //     </ul>
    //   </div>
    //   <div className={container.contentContainer}>
    //     <h3>Medium-Term Development Goals</h3>
    //     <p>To make this project fully realized, these are some major next steps:</p>
    //     <ul>
    //       <li>
    //         Community
    //         <ul>
    //           <li>Grow WikiCollage community.</li>
    //           <li>Whitelist more trusted administrators.</li>
    //           <li>Better documentation and code commenting.</li>
    //         </ul>
    //       </li>
    //       <li>
    //         Automated NFT minting process.
    //         <ul>
    //           <li>Admins select developed topics and initiate NFT minting, limited by monthly maximum.</li>
    //           <li>
    //             Algo to calculate fractional ownership between contributors, admin, WC, and possibly other parties.
    //           </li>
    //           <li>Connection with OpenSea API, automated minting, notications, and social posts.</li>
    //         </ul>
    //       </li>
    //     </ul>
    //   </div>
    //   <div className={container.contentContainer}>
    //     <h3>Get Involved!</h3>
    //     <p>Search for topics, make additions, and connect your wallet in case of a future NFT mint.</p>
    //     <p>
    //       Or, view the <a href={GITHUB_URL}>code</a> and help build!
    //     </p>
    //   </div>
    //   <div className={container.contentContainer}>
    //     <p>© WikiCollage 2022</p>
    //   </div>
    // </div>
  );
};

export default AboutPage;
