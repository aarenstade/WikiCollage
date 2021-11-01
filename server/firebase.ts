import admin, { ServiceAccount } from "firebase-admin";

import serviceAccount from "../creds/service-account.json";

const account = serviceAccount as ServiceAccount;

if (!admin.apps.length) {
  //   if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    //   const config = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(account),
      databaseURL: "https://visual-collab-default-rtdb.firebaseio.com/",
    });
  } catch (error) {
    console.error(`Firebase Admin Init Error: ${error}`);
  }
  //   }
}

export const ADMIN_ST = admin.storage().bucket("gs://just-a-box-app.appspot.com");
export const ADMIN_RTDB = admin.database();
export const ADMIN_AUTH = admin.auth();