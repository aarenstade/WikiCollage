import html2canvas from "html2canvas";
import { getDownloadURL } from "@firebase/storage";
import { STORAGE_REF } from "./client/firebase";
import { authPostRequest } from "./client/requests";
import { BASE_URL } from "./config";
import { convertAllHtmlImagesToBase64 } from "./utils/image-utils";
import { CanvasElementItem, ElementToEmbed } from "./types/elements";
import { AdditionItem, TopicItem } from "./types/schemas";

// what would it take to perform all of this serverside?

// html2canvas --> sending html element parameters in some schema then rebuilding server side?

// but all the database updates and stuff?
// well we'd have to authenticate the server
// it just all takes server requests

// id like to optimize this flow,

export const buildImageFromElement = async (element: CanvasElementItem): Promise<string | null> => {
  const elementRoot = document.getElementById(element.html_id);
  console.log({ elementRoot });
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

export const embedNewMural = async (token: string, elementObjects: ElementToEmbed[], collage?: string) => {
  const muralRes = await authPostRequest(token, `${BASE_URL}/api/merge-mural`, { elements: elementObjects, collage });
  if (muralRes.data) return await getDownloadURL(STORAGE_REF(muralRes.data));
};

export const insertNewAddition = async (token: string, addition: AdditionItem, topic: TopicItem | null) => {
  const response = await authPostRequest(token, `${BASE_URL}/api/db/additions`, { addition, topic });
  if (response.data) return response.data;
};
