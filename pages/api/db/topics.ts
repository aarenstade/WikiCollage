import escapeStringRegexp from "escape-string-regexp";
import { NextApiRequest, NextApiResponse } from "next";
import apiHandler from "../../../server/api-middleware";
import { Topic } from "../../../types/mongodb/models";
import { TopicItem } from "../../../types/mongodb/schemas";
import { decodeTopicUrlParam } from "../../../utils/utils";

const handler = apiHandler();
// fetch multiple topics (for search QueryTextField)
// INPUT --> ?topic={String}
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const value = req.query.search.toString();
    const search = decodeTopicUrlParam(escapeStringRegexp(value));

    const query = await Topic.find({ topic: { $regex: search } })
      .select("topic")
      .limit(10)
      .lean();
    const results = query.map((t: TopicItem) => t.topic);

    res.send({ results });
  } catch (error) {
    console.error({ error });
    res.status(500).send(error);
  }
});

export default handler;
