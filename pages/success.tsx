/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import useCollage from "../hooks/useCollage";

const SuccessPage = () => {
  const router = useRouter();
  const { topic } = router.query;
  const collage = useCollage(topic?.toString());

  const [finalLink, setFinalLink] = useState(`${BASE_URL}/t/${topic?.toString()}`);

  useEffect(() => {
    setFinalLink(`${BASE_URL}/t/${topic?.toString()}`);
  }, [topic]);

  return (
    <div>
      <h1>Thank You!</h1>
      <p>Your addition {topic && `to "${topic}"`} was recieved and embedded into the collage.</p>
      {collage.addition?.url && <img src={collage.addition.url} alt="Collage" width="500px" />}
      <p>
        Check it out: <a href={finalLink}>{finalLink}</a>
      </p>
      {/* TODO share links */}
    </div>
  );
};

export default SuccessPage;
