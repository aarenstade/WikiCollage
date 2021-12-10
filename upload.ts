// import html2canvas from "html2canvas";
import { getDownloadURL } from "@firebase/storage";
import { STORAGE_REF } from "./client/firebase";
import { authPostRequest } from "./client/requests";
import { BASE_URL } from "./config";
import { ElementToEmbed } from "./types/elements";
import { AdditionItem, TopicItem } from "./types/mongodb/schemas";

// export const buildImageFromElement = async (element: CanvasElementItem): Promise<string | null> => {
//   try {
//     const elementRoot = document.getElementById(element.html_id);
//     if (elementRoot) {
//       elementRoot.style["backgroundColor"] = "blue";

//       const elementCanvas = await html2canvas(elementRoot, {
//         scale: 1,
//         width: element.width,
//         height: element.height,
//         backgroundColor: null,
//         onclone: async (clone) => await convertAllHtmlImagesToBase64(clone),
//       });

//       return elementCanvas.toDataURL("image/png", 0.8);
//     }
//     return null;
//   } catch (error) {
//     return null;
//   }
// };

export const embedNewMural = async (token: string, elementObjects: ElementToEmbed[], collage?: string) => {
  try {
    const muralRes = await authPostRequest(token, `${BASE_URL}/api/merge-mural`, { elements: elementObjects, collage });
    if (muralRes && muralRes.data) return await getDownloadURL(STORAGE_REF(muralRes.data));
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
