import { NextApiRequest, NextApiResponse } from 'next';
import { AbortService } from '../../../lib/services/abort_service';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { OnMemoryRepository, RealRepository } = await import(
    '../../../lib/repository'
  );

  if (req.method !== 'PUT') {
    res.status(400).end('Bad Request');
    return;
  }
  const { id } = req.query;
  if (typeof id !== 'string') {
    res.status(400).end('Bad Request');
    return;
  }
  AbortService({ askIdToAbort: async () => id }, RealRepository.inst)
    .then(() => {
      res.status(202).end('Accepted');
    })
    .catch(e => res.status(400).end(e));
};
