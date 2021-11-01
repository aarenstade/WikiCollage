import { initializeApp } from "firebase/app";
import { getStorage, ref as stRef } from "firebase/storage";
import { getDatabase, ref as dbRef } from "firebase/database";
import { firebaseConfig } from "../firebase-client";

const app = initializeApp(firebaseConfig);

const storage = getStorage(app, "gs://visual-collab.appspot.com");
export const STORAGE_REF = (path: string) => stRef(storage, path);

const database = getDatabase(app);
export const DATABASE_REF = (path: string) => dbRef(database, path);
