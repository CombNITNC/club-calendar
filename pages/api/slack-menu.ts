import { NextApiRequest, NextApiResponse } from 'next';
import {} from '@slack/interactive-messages';

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
  res.status(200).json({
    response_action: 'update',
    view: await (await import('../../slack/modal-block')).default(),
  });
};
