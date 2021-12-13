import { EMPTY_COLLAGE_URI, GOOGLE_STORAGE_BUCKET } from "./config";
import { writeImageFile } from "./utils";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import sharp from "sharp";
import fs from "fs";
import { v4 } from "uuid";

admin.initializeApp();
const storage = admin.storage().bucket(GOOGLE_STORAGE_BUCKET);

export const mergeCollage = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) throw new Error("unauthenticated");

    const additionUrl = data.additionUrl;
    const collageUrl = data.collage_url;

    const additionPath = `/tmp/${v4()}.png`;
    const collagePath = `/tmp/${v4()}.png`;
    const newCollagePath = `/tmp/${v4()}.png`;

    await writeImageFile(additionUrl, additionPath);
    if (collageUrl) {
      await writeImageFile(collageUrl, collagePath);
    } else {
      await writeImageFile(EMPTY_COLLAGE_URI, collagePath);
    }

    await sharp(collagePath)
      .composite([{ input: additionPath, gravity: "northwest", top: 0, left: 0 }])
      .toFile(newCollagePath);

    const id = v4();
    const storagePath = `collages/collage_${id}.png`;
    await storage.upload(newCollagePath, { destination: storagePath, resumable: false });

    fs.rmSync(additionPath);
    fs.rmSync(collagePath);
    fs.rmSync(newCollagePath);

    // TODO better response type
    return { success: true, storagePath, id };
  } catch (error) {
    console.error({ error });
    return { success: false, error };
  }
});
