import axios from "axios";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { STORAGE_REF } from "../client/firebase";
import { BASE_URL } from "../config";

export function encodeImageFileAsURL(e: HTMLInputElement): string | null {
  if (e.files) {
    var file = e.files[0];
    var reader = new FileReader();
    let res: string | ArrayBuffer | null = null;
    reader.onloadend = () => (res = reader.result);
    reader.readAsDataURL(file);
    if (typeof res === "string") return res;
  }
  return null;
}

export const convertBase64ToBytes = (img: string | ArrayBuffer): ArrayBuffer | Uint8Array => {
  if (img instanceof ArrayBuffer) return img;
  var arr = img.split(",");
  const bstr = window.atob(arr[1]);
  const len = bstr.length;
  const u8arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return u8arr;
};

export const convertImageToBase64 = (img: ArrayBuffer | Uint8Array): string => {
  let b64Image = "";
  let u8arr = new Uint8Array(img);
  const len = u8arr.byteLength;
  for (let i = 0; i < len; i++) {
    b64Image += String.fromCharCode(u8arr[i]);
  }
  return window.btoa(b64Image);
};

export const createFullPath = (storagePath: string, mimeType: string) => {
  const pathsplit = storagePath.split("/");
  const ext = mimeType.split("/")[1];
  const filename = `${v4()}.${ext}`;
  return pathsplit[pathsplit.length - 1] === "/" ? `${storagePath}${filename}` : `${storagePath}/${filename}`;
};

export const uploadImage = async (file: ArrayBuffer | Uint8Array, path: string): Promise<string | null> => {
  try {
    const ref = STORAGE_REF(path);
    await uploadBytes(ref, file);
    const url = await getDownloadURL(ref);
    return url;
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return null;
  }
};

export const imageUrlToBase64Endpoint = async (url: string): Promise<string | null> => {
  try {
    const res = await axios({ url: `${BASE_URL}/api/image-to-base64`, data: { url }, method: "POST" });
    if (res.data) return res.data;
    return null;
  } finally {
    return null;
  }
};

export const convertAllHtmlImagesToBase64 = (clone: Document) => {
  const pendingImagesPromises = [];
  const pendingPromisesData: any[] = [];

  const imageNodes = clone.getElementsByTagName("img");
  const images = Array.from(imageNodes).filter((img) => !img.src.startsWith("data:image"));

  for (let i = 0; i < images.length; i += 1) {
    // empty promise for each image
    const promise = new Promise((resolve, reject) => {
      pendingPromisesData.push({
        index: i,
        resolve,
        reject,
      });
    });
    pendingImagesPromises.push(promise);
  }

  for (let i = 0; i < images.length; i += 1) {
    axios({ url: `${BASE_URL}/api/image-to-base64`, data: { url: images[i].src }, method: "POST" })
      .then((response) => {
        const data = response.data;
        const pending = pendingPromisesData.find((p) => p.index === i);
        images[i].src = data;
        pending.resolve(data);
      })
      .catch((e) => {
        const pending = pendingPromisesData.find((p) => p.index === i);
        images[i].remove();
        pending.reject(e);
      });
  }

  return Promise.all(pendingImagesPromises);
};
