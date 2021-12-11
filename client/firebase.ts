import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { FirebaseStorage, getStorage, ref as stRef, StorageReference } from "firebase/storage";

let app: FirebaseApp;
let storage: FirebaseStorage;

try {
  app = initializeApp(JSON.parse(process.env.FIREBASE_CLIENT_CONFIG || "{}"));
  storage = getStorage(app, "gs://visual-collab.appspot.com");
} catch (error) {
  console.error({ error });
}

export const STORAGE_REF = (path: string): StorageReference => stRef(storage, path);
export const auth = getAuth();
