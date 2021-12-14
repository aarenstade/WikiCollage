import escapeStringRegexp from "escape-string-regexp";
import { NextApiRequest, NextApiResponse } from "next";
import apiHandler from "../../../server/api-middleware";
import { Topic } from "../../../types/mongodb/models";
import { TopicItem } from "../../../types/mongodb/schemas";
import { decodeTopicUrlParam } from "../../../utils/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //     const query = decodeTopicUrlParam(req.query.query.toString());
    const value = req.query.query.toString();
    const query = decodeTopicUrlParam(escapeStringRegexp(value));
    console.log({ query });
    const results = await Topic.find({ topic: { $regex: `/${query}/` } }).lean();
    console.log({ results });
    res.send({ results });
  } catch (error) {
    console.error({ error });
    res.status(500).send(error);
  }
};

// const handler = apiHandler();
// // fetch multiple topics (for search QueryTextField)
// // INPUT --> ?topic={String}
// handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
//   try {
//     const query = decodeTopicUrlParam(req.query.query.toString());
//     const results = await Topic.find({ topic: { $regex: `/${query}/` } })
//       .lean()
//       .map((doc) => doc[0].topic);
//     console.log({ results });
//     res.send({ results });
//   } catch (error) {
//     console.error({ error });
//     res.status(500).send(error);
//   }
// });

export default handler;
