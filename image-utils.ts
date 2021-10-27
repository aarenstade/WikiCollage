import { getDownloadURL, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { STORAGE_REF } from "./client/firebase";

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

export const createFullPath = (storagePath: string, mimeType: string) => {
  const pathsplit = storagePath.split("/");
  const ext = mimeType.split("/")[1];
  const filename = `${v4()}.${ext}`;
  return pathsplit[pathsplit.length - 1] === "/" ? `${storagePath}${filename}` : `${storagePath}/${filename}`;
};
