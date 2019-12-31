import { FetchService } from '../../lib/services/fetch_service';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { RealRepository } = await import('../../lib/repository');

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
    RealRepository.inst
  ).catch(e => {
    console.error(e);
    res.status(400).end(e);
  });
};
