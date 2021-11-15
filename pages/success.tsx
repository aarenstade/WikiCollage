/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { BASE_URL } from "../config";

const SuccessPage = () => {
  const router = useRouter();
  const { topic, image, id } = router.query;

  const [finalLink, setFinalLink] = useState(`${BASE_URL}/t/${topic}`);

  return (
    <div>
      <h1>Thank You!</h1>
      <p>Your addition {topic && `to "${topic}"`} was recieved and embedded into the collage.</p>
      {image && <img src={image.toString()} alt="Collage" width="500px" />}
      <p>
        Check it out: <a href={finalLink}>{finalLink}</a>
      </p>
      {/* TODO share links */}
    </div>
  );
};

export default SuccessPage;
