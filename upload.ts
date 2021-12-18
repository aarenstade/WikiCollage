import html2canvas from "html2canvas";
import { CALL_CLOUD_FUNCTION } from "./client/firebase";
import { authPostRequest } from "./client/requests";
import { BASE_URL, MURAL_DIMENSION } from "./config";
import { AdditionItem, TopicItem } from "./types/mongodb/schemas";
import { convertAllHtmlImagesToBase64, convertBase64ToBytes } from "./utils/image-utils";

export const createFullAdditionsImage = async (): Promise<ArrayBuffer | undefined> => {
  const root = document.getElementById("elements-root");
  if (root) {
    const canvas = await html2canvas(root, {
      backgroundColor: null,
      scale: 1,
      width: MURAL_DIMENSION,
      height: MURAL_DIMENSION,
      onclone: async (clone) => convertAllHtmlImagesToBase64(clone),
    });

    const base64 = canvas.toDataURL("image/png");
    return convertBase64ToBytes(base64);
  }
};

export const mergeNewCollage = async (
  additionUrl: string,
  collageUrl?: string
): Promise<{ id: string; storagePath: string } | undefined> => {
  const res = await CALL_CLOUD_FUNCTION("mergeCollage", { additionUrl, collageUrl }, { timeout: 120 * 1000 });
  if (res.data.success) {
    const { id, storagePath } = res.data;
    return { id, storagePath };
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
