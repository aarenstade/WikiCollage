import { authGetRequest } from "../client/requests";
import { BASE_URL } from "../config";

export const fetchTopic = async (token: string, topicString: string) =>
  await authGetRequest(token, `${BASE_URL}/api/db/topics?topic=${topicString}`);

export const fetchAdditions = async (token: string, topic_id: string, page: number = 0, limit: number = 1) =>
  await authGetRequest(token, `${BASE_URL}/api/db/additions?topic_id=${topic_id}&page=${page}&limit=${limit}`);
