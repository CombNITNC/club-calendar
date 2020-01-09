import { NextApiRequest, NextApiResponse } from 'next';

type SlackMessage = {
  payload: string;
};

const validate = (obj: any): obj is SlackMessage => {
  return true;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST' || req.body.payload != null) {
    res.status(400).end('Bad Request');
    return;
  }
  const mes = JSON.parse(req.body.payload);
  if (!validate(mes)) {
    res.status(400).end('Bad Request');
    return;
  }
  res.status(200).end('OK');
};
