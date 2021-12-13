import admin, { ServiceAccount } from "firebase-admin";
import { GOOGLE_STORAGE_BUCKET } from "../config";

if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const config = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) as ServiceAccount;
      admin.initializeApp({
        credential: admin.credential.cert(config),
        databaseURL: "https://visual-collab-default-rtdb.firebaseio.com/",
      });
    } catch (error) {
      console.error(`Firebase Admin Init Error: ${error}`);
    }
  }
}

export const ADMIN_ST = admin.storage().bucket(GOOGLE_STORAGE_BUCKET);
export const ADMIN_RTDB = admin.database();
export const ADMIN_AUTH = admin.auth();
