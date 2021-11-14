import { useEffect, useState } from "react";
import { useAuth } from "../services/AuthProvider";
import { fetchAdditions, fetchTopic } from "../services/fetch";
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

interface Collage {
  addition: AdditionItem | null;
  topic: TopicItem | null;
  loading?: boolean;
}

const useCollage = (topicString: string): Collage => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [addition, setAddition] = useState<AdditionItem | null>(null);
  const [topic, setTopic] = useState<TopicItem | null>(null);

  useEffect(() => {
    if (auth?.token) {
      fetchTopicAndAdditions(auth.token, topicString).then((res) => {
        setTopic(res.topic);
        setAddition(res.addition);
        setLoading(false);
      });
    }
  }, [auth?.token, topicString]);

  return { topic, addition, loading };
};

export default useCollage;
