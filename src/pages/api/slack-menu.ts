import { NextApiRequest, NextApiResponse } from "next";

type SlackMessage = {
  token: string;
  trigger_id: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: "/meeting";
  response_url: string;
};

const validate = (obj: any): obj is SlackMessage => {
  if (typeof obj !== "object" || obj == null) {
    return false;
  }
  if (!("command" in obj && obj.command === "/meeting")) {
    return false;
  }
  return true;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST" || !validate(req.body)) {
    res.status(400).end("Bad Request");
    return;
  }
  const { trigger_id } = <SlackMessage>req.body;
  const open_res = await (
    await fetch("https://slack.com/api/views.open", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${process.env.SLACK_OAUTH_TOKEN || ""}`,
      },
      body: JSON.stringify({
        trigger_id,
        view: await (await import("../../slack/modal-block")).default(),
      }),
    })
  ).json();
  if (!open_res.ok) {
    console.log(open_res);
    res.status(500).end("Internal Server Error");
    return;
  }
  res.status(200).end("");
};
