import fs from "fs";
import { v4 } from "uuid";
import { writeImageFile } from "../../server/server-utils";
import { NextApiRequest, NextApiResponse } from "next";

const imageToBase64Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const url = req.body.url.toString();
    const path = `/tmp/${v4()}.png`;

    await writeImageFile(url.toString(), path);

    const buff = fs.readFileSync(path);
    const base64 = "data:image/png;charset=utf-8;base64," + buff.toString("base64");

    fs.rmSync(path);

    res.status(200).send(base64);
  } catch (error) {
    console.log({ error });
    res.status(500).send({ data: error });
  }
};

export default imageToBase64Handler;
