import { authGetRequest } from "../client/requests";
import { BASE_URL } from "../config";

export const fetchTopic = async (token: string, topicString: string) => {
  try {
    return await authGetRequest(token, `${BASE_URL}/api/db/topic?topic=${topicString}`);
  } catch (error) {
    console.error({ error });
  }
};

export const fetchAdditions = async (token: string, topic_id: string, page: number = 0, limit: number = 1) => {
  try {
    return await authGetRequest(token, `${BASE_URL}/api/db/additions?topic_id=${topic_id}&page=${page}&limit=${limit}`);
  } catch (error) {
    console.error({ error });
  }
};
