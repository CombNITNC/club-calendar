import { FetchService } from '../../lib/op/fetch';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET' || req.url == null) {
    res.status(400).end('Bad Request');
    return;
  }
  FetchService(
    {
      show: async meetings => {
        res.status(200).json({ meetings });
      },
    },
    process.env.NODE_ENV === 'production'
      ? await (await import('../../lib/skin/real')).default
      : await (await import('../../lib/skin/on-memory')).default
  ).catch(e => {
    console.error(e);
    res.status(400).end(e);
  });
};
