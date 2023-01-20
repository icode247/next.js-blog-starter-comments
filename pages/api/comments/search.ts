import { NextApiRequest, NextApiResponse } from "next";
import { Comments } from "../../../db/models/comments";
import { SearchQuery } from "@tigrisdata/core/dist/search/types";
import tigrisDb from "../../../lib/tigris";

type Data = {
  result?: Array<Comments>;
  error?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
  ) {
    const { query, page } = req.query;
    try {
      const commentCollection = tigrisDb.getCollection<Comments>(Comments);
      const searchRequest: SearchQuery<Comments> = { q: query as string };
      const results = await commentCollection.search(
        searchRequest,
        Number(page) || 1
      );
      const comments = new Array<Comments>();
      for (const hit of results.hits) {
        comments.push(hit.document);
      }
      res.status(200).json({ result: comments });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }