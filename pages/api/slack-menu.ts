import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';

type SlackMessage = {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: '/meeting';
  response_url: string;
};

const validate = (obj: any): obj is SlackMessage => {
  if (typeof obj !== 'object') {
    return false;
  }
  if (obj.command !== '/meeting') {
    return false;
  }
  return true;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(400).end('Bad Request');
    return;
  }
  const { trigger_id, response_url } = req.body;
  res.status(200).end('OK');
  await fetch(response_url, {
    headers: {
      'Content-type': 'application/json',
      Authorization: process.env.SLACK_OAUTH_TOKEN || '',
    },
    method: 'POST',
    body: JSON.stringify({
      trigger_id,
      view: await (await import('../../slack/modal-block')).default(),
    }),
  });
};
