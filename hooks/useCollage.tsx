import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { CollageState } from "../data/atoms";
import { useAuth } from "../services/AuthProvider";
import { fetchAdditions, fetchTopic } from "../services/fetch";
import { Collage } from "../types/collage";
import { AdditionItem, TopicItem } from "../types/schemas";

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
      topic = topicRes.data;

      const additionRes = await fetchAdditions(token, topic._id, page, limit);
      addition = additionRes.data;
    }
  } catch (error) {
    console.error({ error });
  }

  return { topic, addition };
};

const useCollage = (topicString?: string, page?: number, limit?: number): Collage => {
  const auth = useAuth();
  const [collage, setCollage] = useRecoilState(CollageState);

  useEffect(() => {
    if (auth?.token && topicString) {
      setCollage({ ...collage, loading: true });
      fetchTopicAndAdditions(auth.token, topicString, page, limit)
        .then((res) => {
          const topic: TopicItem = res.topic
            ? { ...res.topic, topic: topicString }
            : { topic: topicString, created_at: new Date(), updated_at: new Date() };
          setCollage({ topic, addition: res.addition, loading: false });
        })
        .catch((err) => {
          console.log({ err });
          setCollage({ ...collage, loading: false });
        });
    }
  }, [auth?.token, topicString]);

  return { topic: collage.topic, addition: collage.addition, loading: collage.loading };
};

export default useCollage;
