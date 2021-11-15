import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { CollageState } from "../data/atoms";
import { useAuth } from "../services/AuthProvider";
import { fetchAdditions, fetchTopic } from "../services/fetch";
import { Collage } from "../types/collage";
import { AdditionItem, TopicItem } from "../types/schemas";

const fetchTopicAndAdditions = async (
  token: string,
  topicString: string
): Promise<{ topic: TopicItem | null; addition: AdditionItem | null }> => {
  let topic;
  let addition;

  try {
    if (token) {
      const topicRes = await fetchTopic(token, topicString);
      topic = topicRes.data;

      const additionRes = await fetchAdditions(token, topic._id);
      addition = additionRes.data;
    }
  } catch (error) {
    console.error({ error });
  }

  return { topic, addition };
};

const useCollage = (topicString?: string): Collage => {
  const auth = useAuth();
  const [collage, setCollage] = useRecoilState(CollageState);

  useEffect(() => {
    if (auth?.token && topicString) {
      fetchTopicAndAdditions(auth.token, topicString).then((res) =>
        setCollage({ topic: res.topic, addition: res.addition, loading: false })
      );
    }
  }, [auth?.token, topicString]);

  return { topic: collage.topic, addition: collage.addition, loading: collage.loading };
};

export default useCollage;
