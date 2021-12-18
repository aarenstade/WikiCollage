import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { FirebaseStorage, getStorage, ref as stRef, StorageReference } from "firebase/storage";
import { Functions, getFunctions, httpsCallable, HttpsCallableOptions } from "firebase/functions";
let app: FirebaseApp;
let storage: FirebaseStorage;
let functions: Functions;

export const firebaseConfig = {
  apiKey: "AIzaSyDAkzjzyyWLIdShZmx-djzobXYDVKt-9ok",
  authDomain: "visual-collab.firebaseapp.com",
  projectId: "visual-collab",
  storageBucket: "visual-collab.appspot.com",
  messagingSenderId: "935348650615",
  appId: "1:935348650615:web:6e82072afaf837ec9c7c72",
  measurementId: "G-M1VBQEG23Q",
};

try {
  app = initializeApp(firebaseConfig);
  storage = getStorage(app, "gs://visual-collab.appspot.com");
  functions = getFunctions(app);
} catch (error) {
  console.error({ error });
}

export const STORAGE_REF = (path: string): StorageReference => stRef(storage, path);

export const CALL_CLOUD_FUNCTION = <T>(name: string, data: T, options?: HttpsCallableOptions) =>
  httpsCallable<T, any>(functions, name, options)(data);

export const auth = getAuth();
