import { NextApiRequest, NextApiResponse } from 'next';
import { AbortService } from '../../../lib/services/abort_service';
import { OnMemoryRepository } from '../../../lib/repository';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    res.status(400).end('Bad Request');
    return;
  }
  const { id } = req.query;
  if (typeof id !== 'string') {
    res.status(400).end('Bad Request');
    return;
  }
  AbortService(
    { askIdToAbort: async () => id },
    OnMemoryRepository.inst
  ).catch(e => res.status(400).end(e));
};
