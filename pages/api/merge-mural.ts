import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { ADMIN_RTDB, ADMIN_ST } from "../../server/firebase";
import sharp, { OverlayOptions } from "sharp";
import fs from "fs";
import request from "request";

const writeImageFile = async (data: string | ArrayBuffer | Buffer, path: string) => {
  if (typeof data === "string") {
    return new Promise((resolve, reject) => {
      request(data).pipe(fs.createWriteStream(path)).on("close", resolve).on("error", reject);
    });
  } else {
    fs.appendFileSync(path, Buffer.from(data));
  }
};

const mergeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const elements = req.body.elements;
    const compositeElements: OverlayOptions[] = [];

    // download images and build list object for sharp composite
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const path = `/tmp/${v4()}.jpg`;
      await writeImageFile(element.uri, path);

      compositeElements.push({
        input: path,
        gravity: "northwest",
        top: element.y,
        left: element.x,
      });
    }

    // fetch current mural
    const muralUrlRes = await ADMIN_RTDB.ref("/latest_submission/").get();
    const muralUrl = muralUrlRes.val().mural;

    // download mural image
    const muralPath = `/tmp/mural.jpg`;
    await writeImageFile(muralUrl, muralPath);

    // composite elements onto mural
    const newMuralPath = "/tmp/newMural.jpg";
    await sharp(muralPath).composite(compositeElements).toFile(newMuralPath);

    // upload new mural
    const storagePath = `murals/mural_${v4()}.jpg`;
    await ADMIN_ST.upload(newMuralPath, { destination: storagePath });

    // delete all image files
    for (let i = 0; i < compositeElements.length; i++) {
      const path = compositeElements[i].input;
      if (path && typeof path === "string") fs.rmSync(path);
    }

    // return storagePath
    res.status(200).send(storagePath);
  } catch (error) {
    console.error({ error });
    res.status(500).send(error);
  }
};

export default mergeHandler;
