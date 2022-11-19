import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data, path } = req.body;

    const response = await fetch(`http://169.51.205.252:31060/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    res.status(200).json(json);
  } catch (err) {
    res.status(500);
  }
}
