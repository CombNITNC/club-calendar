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
  const auth_token = req.headers['authorization'];
  const { trigger_id, response_url } = req.body;
  await fetch(response_url, {
    headers: {
      'content-type': 'application/json',
      authorization: auth_token || '',
    },
    method: 'POST',
    body: JSON.stringify({
      trigger_id,
      view: await (await import('../../slack/modal-block')).default(),
    }),
  });
  res.status(202).end('Accepted');
};
