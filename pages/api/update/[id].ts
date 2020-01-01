import { DateString, validateDateString } from '../../../lib/meeting';
import { UpdateService } from '../../../lib/services/update_service';
import { NextApiRequest, NextApiResponse } from 'next';

type UpdateBody = { name?: string; date?: DateString };

const validateParam = (body: any): body is UpdateBody => {
  if (!('name' in body && typeof body.name === 'string')) {
    return false;
  }
  if (!('date' in body && validateDateString(body.date))) {
    return false;
  }
  return true;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    res.status(400).end('Bad Request');
    return;
  }
  const { id } = req.query;
  const body = JSON.parse(req.body);
  if (!validateParam(body) || typeof id !== 'string') {
    res.status(400).end('Bad Request');
    return;
  }
  const { name, date: dateStr } = body;
  const param = {
    name,
    date: dateStr?.toDate(),
  };

  await UpdateService(
    {
      askId: async () => id,
      askParam: async () => param,
    },
    process.env.NODE_ENV === 'production'
      ? await (await import('../../../lib/repository')).RealRepository.inst
      : await (await import('../../../lib/repository')).OnMemoryRepository.inst
  ).catch(e => res.status(400).end(e));

  res.status(202).end('Accepted');
};
