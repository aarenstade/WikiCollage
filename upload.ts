// import html2canvas from "html2canvas";
import { getDownloadURL } from "@firebase/storage";
import { STORAGE_REF } from "./client/firebase";
import { authPostRequest } from "./client/requests";
import { BASE_URL } from "./config";
import { AdditionItem, TopicItem } from "./types/mongodb/schemas";

export const embedNewCollage = async (token: string, addition_url: string, collage_url?: string) => {
  try {
    const res = await authPostRequest(token, `${BASE_URL}/api/merge-collage`, { addition_url, collage_url });
    if (res && res.data) return await getDownloadURL(STORAGE_REF(res.data));
  } catch (error) {
    console.error({ error });
  }
};

export const insertNewAddition = async (token: string, addition: AdditionItem, topic: TopicItem | null) => {
  try {
    const response = await authPostRequest(token, `${BASE_URL}/api/db/additions`, { addition, topic });
    if (response && response.data) return response.data;
  } catch (error) {
    console.error({ error });
  }
};
