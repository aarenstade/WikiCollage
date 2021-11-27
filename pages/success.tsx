/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import FlexibleCard from "../components/FlexibleCard";
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
      <FlexibleCard>
        <h1 style={{ fontSize: "50px", margin: "0" }}>Thank You</h1>
        <p>Your additions {topic && `to "${topic}"`} was recieved and embedded into the collage.</p>
        {collage.addition?.url && <img src={collage.addition.url} alt="Collage" width="500px" />}
        <p>
          <a href={finalLink}>Check it out here!</a>
        </p>
      </FlexibleCard>
      {/* TODO share links */}
    </div>
  );
};

export default SuccessPage;
