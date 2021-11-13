import mongoose from "mongoose";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { MONGODB_URL } from "../../creds/mongodb";

const withDatabase = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  if (mongoose.connection.readyState === 1) return handler(req, res);
  await mongoose.connect(MONGODB_URL);
  return handler(req, res);
};

export default withDatabase;
