// import html2canvas from "html2canvas";
import { getDownloadURL } from "@firebase/storage";
import { CALL_CLOUD_FUNCTION, STORAGE_REF } from "./client/firebase";
import { authPostRequest } from "./client/requests";
import { BASE_URL } from "./config";
import { AdditionItem, TopicItem } from "./types/mongodb/schemas";

export const embedNewCollage = async (
  additionUrl: string,
  collageUrl?: string
): Promise<{ id: string; url: string } | undefined> => {
  try {
    const res = await CALL_CLOUD_FUNCTION(
      "mergeCollage",
      {
        additionUrl,
        collageUrl,
      },
      { timeout: 120 }
    );
    if (res.data.success) {
      const url = await getDownloadURL(STORAGE_REF(res.data));
      return { url, id: res.data.id };
    }
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
