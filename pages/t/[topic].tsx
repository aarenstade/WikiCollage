import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import useCollage from "../../hooks/useCollage";

import GlobalCollabView from "../../views/GlobalCollabView";

const CollagePage: NextPage = () => {
  const router = useRouter();
  const topicString = router.query.topic?.toString();

  const collage = useCollage(topicString);

  return <GlobalCollabView collage={collage} />;
};

export default CollagePage;
