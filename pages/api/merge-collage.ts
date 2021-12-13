import { NextApiRequest, NextApiResponse } from "next";
import { EMPTY_COLLAGE_URI } from "../../config";
import { writeImageFile } from "../../server/server-utils";
import { ADMIN_ST } from "../../server/firebase";
import apiHandler from "../../server/api-middleware";
import sharp from "sharp";
import { v4 } from "uuid";
import fs from "fs";

const handler = apiHandler();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("merging collage");
    const start = new Date().getTime();
    const addition_url = req.body.addition_url;
    const collage_url = req.body.collage_url;

    const additionPath = `/tmp/${v4()}.png`;
    const collagePath = `/tmp/${v4()}.png`;
    const newCollagePath = `/tmp/${v4()}.png`;

    await writeImageFile(addition_url, additionPath);
    if (collage_url) {
      await writeImageFile(collage_url, collagePath);
    } else {
      await writeImageFile(EMPTY_COLLAGE_URI, collagePath);
    }

    await sharp(collagePath)
      .composite([{ input: additionPath, gravity: "northwest", top: 0, left: 0 }])
      .toFile(newCollagePath);

    const storagePath = `murals/mural_${v4()}.png`;
    await ADMIN_ST.upload(newCollagePath, { destination: storagePath });

    fs.rmSync(additionPath);
    fs.rmSync(collagePath);
    fs.rmSync(newCollagePath);

    const end = new Date().getTime();

    console.log("api done");
    console.log(`${(end - start) / 1000} seconds`);

    res.status(200).send(storagePath);
  } catch (error) {
    console.error({ error });
    res.status(500).send(error);
  }
});

export default handler;
