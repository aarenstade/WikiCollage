import admin, { ServiceAccount } from "firebase-admin";

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

export const ADMIN_ST = admin.storage().bucket("gs://visual-collab.appspot.com");
export const ADMIN_RTDB = admin.database();
export const ADMIN_AUTH = admin.auth();
