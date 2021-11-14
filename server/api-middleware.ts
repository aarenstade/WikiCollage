import mongoose from "mongoose";
import nextConnect, { NextHandler } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { MONGODB_URL } from "../creds/mongodb";
import { ADMIN_AUTH } from "./firebase";

const verifyAuthentication = async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const valid = await ADMIN_AUTH.verifyIdToken(token);
    if (!valid || !valid.uid) res.status(404).send("Not Authenticated");
    return next();
  } else {
    res.status(404).send("Not Authenticated");
  }
};

const prepareDatabase = async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
  if (mongoose.connection.readyState === 1) return next();
  await mongoose.connect(MONGODB_URL);
  return next();
};

const apiHandler = () => {
  const handler = nextConnect();
  handler.use(verifyAuthentication);
  handler.use(prepareDatabase);
  return handler;
};

export default apiHandler;
