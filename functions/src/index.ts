import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import sharp from "sharp";
import fs from "fs";
import { v4 } from "uuid";
import { writeImageFile } from "./utils";

export const GOOGLE_STORAGE_BUCKET = "gs://visual-collab.appspot.com";
export const EMPTY_COLLAGE_URI =
  "https://firebasestorage.googleapis.com/v0/b/visual-collab.appspot.com/o/empty-collage.png?alt=media&token=dc067bc8-0a43-4865-86a6-a3b6c1057f9d";

admin.initializeApp();
const storage = admin.storage().bucket(GOOGLE_STORAGE_BUCKET);

exports.mergeCollage = functions.https.onCall(async (data, context) => {
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
      .composite([
        { input: additionPath, gravity: "northwest", top: 0, left: 0 },
      ])
      .toFile(newCollagePath);

    const id = v4();
    const storagePath = `collages/collage_${id}.png`;
    await storage.upload(newCollagePath, {
      destination: storagePath,
      resumable: false,
    });

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
