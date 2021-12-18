import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { v4 } from "uuid";
import { writeImageFile } from "./utils";
import sharp from "sharp";
import fs from "fs";
import os from "os";
import { EMPTY_COLLAGE_URI, GOOGLE_STORAGE_BUCKET } from "./config";

admin.initializeApp();
const storage = admin.storage().bucket(GOOGLE_STORAGE_BUCKET);

exports.mergeCollage = functions
  .runWith({ memory: "256MB", timeoutSeconds: 120, maxInstances: 8 })
  .https.onCall(async (data: any, context: functions.https.CallableContext) => {
    try {
      if (!context.auth) throw new Error("unauthenticated");

      const additionUrl = data.additionUrl;
      const collageUrl = data.collageUrl;

      const tmpDir = os.tmpdir();
      const additionPath = `${tmpDir}/${v4()}.png`;
      const collagePath = `${tmpDir}/${v4()}.png`;
      const newCollagePath = `${tmpDir}/${v4()}.png`;

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
      await storage.upload(newCollagePath, {
        destination: storagePath,
        resumable: false,
      });

      fs.unlinkSync(additionPath);
      fs.unlinkSync(collagePath);
      fs.unlinkSync(newCollagePath);

      // TODO better response type
      return { success: true, storagePath, id };
    } catch (error) {
      console.error({ error });
      return { success: false, error };
    }
  });
