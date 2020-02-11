import { DateString } from '../../../lib';
import { UpdateService } from '../../../lib/op/update';
import { NextApiRequest, NextApiResponse } from 'next';

type UpdateBody = { name?: string; date?: string };

const validateParam = (body: any): body is UpdateBody => {
  if (!('name' in body && typeof body.name === 'string')) {
    return false;
  }
  if (!('date' in body && DateString.ableTo(body.date))) {
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
    date: dateStr ? DateString.to(dateStr).toDate() : undefined,
  };

  await UpdateService(
    {
      askId: async () => id,
      askParam: async () => param,
    },
    process.env.NODE_ENV === 'production'
      ? await (await import('../../../lib/skin/real')).default
      : await (await import('../../../lib/skin/on-memory')).default
  ).catch(e => res.status(400).end(e));

  res.status(202).end('Accepted');
};
