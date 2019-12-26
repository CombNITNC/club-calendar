import {
  DateString,
  validateDateString,
  dateFromString,
  validateKind,
  MeetingKind,
} from '../../../lib/meeting';
import { OnMemoryRepository } from '../../../lib/repository';
import {
  UpdateService,
  UpdateParam,
} from '../../../lib/services/update_service';
import { NextApiRequest, NextApiResponse } from 'next';

type UpdateBody = { name?: string; date?: DateString };

const validateParam = (body: any): body is UpdateBody => {
  if (!('name' in body && typeof body.name !== 'string')) {
    return false;
  }
  if (!('date' in body && !validateDateString(body.date))) {
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
    date: (dateStr && dateFromString(dateStr)) || undefined,
  };

  UpdateService(
    {
      askId: async () => id,
      askParam: async () => param,
    },
    OnMemoryRepository.inst
  );
};
