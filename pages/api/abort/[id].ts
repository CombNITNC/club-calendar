import { NextApiRequest, NextApiResponse } from 'next';
import { AbortService } from '../../../lib/services/abort_service';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    res.status(400).end('Bad Request');
    return;
  }
  const { id } = req.query;
  if (typeof id !== 'string') {
    res.status(400).end('Bad Request');
    return;
  }

  await AbortService(
    { askIdToAbort: async () => id },
    process.env.NODE_ENV === 'production'
      ? await (await import('../../../lib/repository')).RealRepository.inst
      : await (await import('../../../lib/repository')).OnMemoryRepository.inst
  ).catch(e => res.status(400).end(e));

  res.status(202).end('Accepted');
};
