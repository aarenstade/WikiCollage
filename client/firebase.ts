import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref as stRef } from "firebase/storage";
import { getDatabase, ref as dbRef } from "firebase/database";
import { firebaseConfig } from "../firebase-client";

const app = initializeApp(firebaseConfig);

const storage = getStorage(app, "gs://just-a-box-app.appspot.com");
export const STORAGE_REF = (path: string) => stRef(storage, path);

const database = getDatabase(app);
export const DATABASE_REF = (path: string) => dbRef(database, path);

// const analytics = getAnalytics(app);
