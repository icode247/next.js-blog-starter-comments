import type { NextApiRequest, NextApiResponse } from "next";
import { Comments } from "../../../db/models/comments";
import tigrisDB from "../../../lib/tigris";

type Response = {
  result?: Array<Comments>;
  error?: string;
};

async function handleGet(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const commentsCollection = tigrisDB.getCollection<Comments>(Comments);
    const cursor = commentsCollection.findMany();
    const comments = await cursor.toArray();
    res.status(200).json({ result: comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse<Response>) {
    try {
      const comment = JSON.parse(req.body) as Comments;
      const commentsCollection = tigrisDB.getCollection<Comments>(Comments);
      const inserted = await commentsCollection.insertOne(comment);
      res.status(200).json({ result: [inserted] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response>
  ) {
    switch (req.method) {
      case "GET":
        await handleGet(req, res);
        break;
      case "POST":
        await handlePost(req, res);
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }