import mongoose from "mongoose";
import nextConnect, { NextHandler } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { ADMIN_AUTH } from "./firebase";

const verifyAuthentication = async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const valid = await ADMIN_AUTH.verifyIdToken(token);
      if (!valid || !valid.uid) res.status(404).send("Not Authenticated");
      return next();
    } else {
      res.status(404).send("Not Authenticated");
    }
  } catch (error) {
    console.error({ error });
    res.status(500).send(error);
  }
};

const prepareDatabase = async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
  try {
    if (mongoose.connection.readyState === 1) return next();
    if (process.env.MONGODB_URL) await mongoose.connect(process.env.MONGODB_URL);
    return next();
  } catch (error) {
    console.error({ error });
    res.status(500).send(error);
  }
};

const apiHandler = () => {
  const handler = nextConnect();
  handler.use(verifyAuthentication);
  handler.use(prepareDatabase);
  return handler;
};

export default apiHandler;
