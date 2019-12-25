import {
  DateString,
  validateDateString,
  dateFromString,
  validateKind,
  MeetingKind,
} from '../../lib/meeting';
import { OnMemoryRepository } from '../../lib/repository';
import { CreateService } from '../../lib/services/create_service';
import { NextApiRequest, NextApiResponse } from 'next';

type CreateParam = { kind: MeetingKind; name: string; date: DateString };

const validateParam = (body: any): body is CreateParam => {
  if (!('kind' in body) || !validateKind(body.kind)) {
    return false;
  }
  if (!('name' in body) || typeof body.name !== 'string') {
    return false;
  }
  if (!('date' in body) || !validateDateString(body.date)) {
    return false;
  }
  return true;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(400).end('Bad Request');
    return;
  }
  const body = JSON.parse(req.body);
  if (!validateParam(body)) {
    res.status(400).end('Bad Request');
    return;
  }

  CreateService(
    {
      askMeeting: async () => ({
        ...body,
        date: dateFromString(body.date),
        expired: false,
        _id: '0',
      }),
      askDuration: async () => {
        const date = dateFromString(body.date);
        return [date, date];
      },
      reportCreatedIds: async ids => {
        res.status(200).end(JSON.stringify({ ids }));
      },
    },
    OnMemoryRepository.inst
  );
};
