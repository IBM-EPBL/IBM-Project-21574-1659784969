import type { NextApiRequest, NextApiResponse } from "next";
import { ALLOWED_ORIGINS } from "../../lib/origins";

type Data = {
  data: [];
  next: null | string;
  error?: string;
  nextIndex?: string;
  activeTopic?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { url, nextIndex, activeTopic } = req.body;

    const { origin } = req.headers;

    if (origin && ALLOWED_ORIGINS.indexOf(origin) === -1) {
      return res.status(403).json({ data: [], error: "Forbidden", next: null });
    }

    res.setHeader("Access-Control-Allow-Origin", origin || "*");

    if (typeof url !== "string")
      return res
        .status(400)
        .json({ error: "Invalid url", data: [], next: null });

    const parsedURL = `${process.env.API_URL}?url=${encodeURIComponent(
      url
    )}&nextIndex=${nextIndex}&activeTopic=${activeTopic}&activeNavIndex=0&topicEngName=${activeTopic}`;
    const response = await fetch(parsedURL);
    const json = await response.json();

    res.status(200).json({
      data: json?.data?.rows || [],
      next: json?.url || null,
      nextIndex: json?.nextIndex || null,
      activeTopic: json?.activeTopic || null,
    });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
}
