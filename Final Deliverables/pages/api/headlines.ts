import { JSDOM } from "jsdom";
import { NextApiRequest, NextApiResponse } from "next";
import { ALLOWED_ORIGINS } from "../../lib/origins";

const order = ["For You"];

const fetchNParse = async (url: string) => {
  try {
    const data = await fetch(url);
    const html = await data.text();
    const dom = new JSDOM(html, { runScripts: "dangerously" });
    const response = dom.window.__STATE.topicsList || {};
    return response;
  } catch (err) {
    console.log(err);

    return null;
  }
};

function parseTopic(topic = "For You", data: any) {
  let topics: any = null;

  if (topic === "For You") {
    topics = data[0];
  } else {
    topics = data.find((tp: any) => tp.name === topic);
  }

  if (topics) {
    return {
      data: topics?.data?.data.rows || [],
      next: topics.data?.data?.nextPageUrl || null,
      nextIndex: topics.data?.data?.count,
      activeTopic: topics?.topicType,
    };
  }
}

export default async function getHeadlines(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { lang, topic } = query;
  let base_url = process.env.BASE_URL;

  const { origin } = req.headers;

  if (origin && ALLOWED_ORIGINS.indexOf(origin) === -1) {
    return res.status(403).json({ data: [], error: "Forbidden", next: null });
  }

  res.setHeader("Access-Control-Allow-Origin", origin || "*");

  if (typeof lang !== "string")
    return res.status(400).json({ error: "Invalid location" });

  if (typeof topic !== "string")
    return res.status(400).json({ error: "Invalid topic" });

  let response = null;

  if (topic === "For You") {
    base_url = process.env.BASE_URL?.replace("english", lang) || "";
  } else {
    base_url = process.env.BASE_URL?.replace("for+you", topic) || "";
  }

  response = await fetchNParse(base_url);
  const news = parseTopic(topic, response);
  res.status(200).json(news);
}
