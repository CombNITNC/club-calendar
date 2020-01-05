import { DateString, validateKind, MeetingKind } from '../../lib/meeting';
import { CreateService } from '../../lib/services/create_service';
import { NextApiRequest, NextApiResponse } from 'next';

type CreateParam = { kind: MeetingKind; name: string; date: string };

const validateParam = (body: any): body is CreateParam => {
  if (!('kind' in body) || !validateKind(body.kind)) {
    return false;
  }
  if (!('name' in body) || typeof body.name !== 'string') {
    return false;
  }
  if (!('date' in body)) {
    try {
      DateString.from(body.date);
    } catch {
      return false;
    }
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
  const dateStr = DateString.from(body.date);

  CreateService(
    {
      askMeeting: async () => ({
        ...body,
        date: dateStr.toDate(),
        expired: false,
        _id: '0',
      }),
      askDuration: async () => {
        const date = dateStr.toDate();
        return [date, date];
      },
      reportCreatedIds: async ids => {
        res.status(200).json({ ids });
      },
    },
    process.env.NODE_ENV === 'production'
      ? await (await import('../../lib/repository/Real')).default
      : await (await import('../../lib/repository/OnMemory')).default
  ).catch(e => {
    console.error(e);
    res.status(500).end('Internal Server Error');
  });
};
