import { NextApiRequest, NextApiResponse } from 'next';

type SlackMessage = {
  kind: string;
  text: string;
  date: string;
};

const validate = (obj: any): obj is SlackMessage => {
  return true;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(req.method === 'POST' && validate(req.body))) {
    res.status(400).end('Bad Request');
    return;
  }
  res.status(200).json(req.body);
};
