import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { ADMIN_RTDB, ADMIN_ST } from "../../server/firebase";
import axios from "axios";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import html2canvas from "html2canvas";
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
    const url = req.body.url.toString();
    console.log(`merge mural with ${url}`);

    const layerPath = `/tmp/${v4()}.png`;
    const muralPath = `/tmp/${v4()}.png`;
    const mergePath = `/tmp/${v4()}.png`;

    // get mural url
    const muralUrlRes = await ADMIN_RTDB.ref("/latest_submission/").get();
    const muralUrl = muralUrlRes.val();
    console.log({ muralUrl });

    if (muralUrl) {
      await writeImageFile(url, layerPath);
      await writeImageFile(muralUrl, muralPath);

      await sharp(mergePath)
        .composite([{ input: layerPath }])
        .toFile(mergePath);

      console.log("images merged");

      const storageFilepath = `/murals/mural_${v4()}.png`;
      await ADMIN_ST.upload(mergePath, { destination: storageFilepath });

      console.log(storageFilepath);
      fs.rmSync(mergePath);
      fs.rmSync(layerPath);
      fs.rmSync(muralPath);

      res.status(500).send(storageFilepath);
    } else {
      res.status(400).send("ERROR");
    }
  } catch (error) {
    console.error({ error });
    res.status(500).send(error);
  }
};

export default mergeHandler;
