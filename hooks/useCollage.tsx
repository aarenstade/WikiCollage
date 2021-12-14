import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { CollageState } from "../data/atoms";
import { fetchAdditions, fetchTopic } from "../services/fetch";
import { Collage } from "../types/collage";
import { AdditionItem, TopicItem } from "../types/mongodb/schemas";
import { encodeTopicUrlParam, isTopicOpen } from "../utils/utils";
import useAuth from "./useAuth";

interface UseCollageHook extends Collage {
  setLoading: (v: boolean) => void;
}

const fetchTopicAndAdditions = async (
  token: string,
  topicString: string,
  page: number = 0,
  limit: number = 1
): Promise<{ topic: TopicItem | null; addition: AdditionItem | null }> => {
  let topic;
  let addition;

  try {
    if (token) {
      const topicRes = await fetchTopic(token, topicString);
      topic = topicRes && topicRes.data;

      const additionRes = await fetchAdditions(token, topic._id, page, limit);
      addition = additionRes && additionRes.data;
    }
  } catch (error) {
    console.error({ error });
  }

  return { topic, addition };
};

const useCollage = (topicString?: string, page?: number, limit?: number): UseCollageHook => {
  const auth = useAuth();
  const [collage, setCollage] = useRecoilState(CollageState);

  const setLoading = (v: boolean) => setCollage({ ...collage, loading: v });

  useEffect(() => {
    if (auth?.firebase?.token && topicString) {
      setCollage({ ...collage, loading: true });
      fetchTopicAndAdditions(auth.firebase.token, topicString, page, limit)
        .then((res) => {
          const topic: TopicItem = res.topic
            ? { ...res.topic, topic: topicString }
            : {
                topic: topicString.toLowerCase(),
                slug: encodeTopicUrlParam(topicString),
                created_at: new Date(),
                updated_at: new Date(),
              };
          const { isOpen } = isTopicOpen(res.addition?.timestamp && new Date(res.addition.timestamp).getTime());
          setCollage({ topic, addition: res.addition, open: isOpen, loading: false });
        })
        .catch((err) => {
          console.log({ err });
          setCollage({ ...collage, loading: false });
        });
    }
  }, [auth?.firebase, topicString]);

  return {
    topic: collage.topic,
    addition: collage.addition,
    open: collage.open,
    loading: collage.loading,
    setLoading,
  };
};

export default useCollage;
