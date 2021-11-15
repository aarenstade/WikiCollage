import html2canvas from "html2canvas";
import { getDownloadURL } from "@firebase/storage";
import { STORAGE_REF } from "./client/firebase";
import { authPostRequest } from "./client/requests";
import { BASE_URL } from "./config";
import { convertAllHtmlImagesToBase64, convertBase64ToBytes } from "./image-utils";
import { CanvasElementItem, ElementToEmbed } from "./types/elements";
import { AdditionItem } from "./types/schemas";

export const buildImageFromElement = async (element: CanvasElementItem): Promise<string | null> => {
  const elementRoot = document.getElementById(element.html_id);
  if (elementRoot) {
    elementRoot.style["backgroundColor"] = "blue";

    const elementCanvas = await html2canvas(elementRoot, {
      scale: 1,
      width: element.width,
      height: element.height,
      backgroundColor: null,
      onclone: async (clone) => await convertAllHtmlImagesToBase64(clone),
    });

    return elementCanvas.toDataURL("image/png", 0.8);
  }
  return null;
};

export const embedNewMural = async (token: string, elementObjects: ElementToEmbed[]) => {
  const muralRes = await authPostRequest(token, `${BASE_URL}/api/merge-mural`, { elements: elementObjects });
  if (muralRes.data) return await getDownloadURL(STORAGE_REF(muralRes.data));
};

export const insertNewAddition = async (token: string, addition: AdditionItem) => {
  const response = await authPostRequest(token, `${BASE_URL}/api/db/additions`, { addition });
  if (response.data) return response.data._id;
};
