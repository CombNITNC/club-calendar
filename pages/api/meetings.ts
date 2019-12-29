import { FetchService } from '../../lib/services/fetch_service';
import { NextApiRequest, NextApiResponse } from 'next';
import { OnMemoryRepository, RealRepository } from '../../lib/repository';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET' || req.url == null) {
    res.status(400).end('Bad Request');
    return;
  }
  FetchService(
    {
      show: async meetings => {
        res.status(200).end(JSON.stringify({ meetings }));
      },
    },
    RealRepository.inst
  ).catch(e => {
    console.error(e);
    res.status(400).end(e);
  });
};
