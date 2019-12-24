import { FetchService } from '../../lib/services/fetch_service';
import {
  MeetingKind,
  testDatas,
  DateString,
  validateKind,
  validateDateString,
  dateFromString,
} from '../../lib/meeting';
import { ParsedUrlQuery } from 'querystring';
import { NextApiRequest, NextApiResponse } from 'next';
import { OnMemoryRepository } from '../../lib/repository';

export type FetchParameter = {
  kind: MeetingKind;
  from: DateString;
  to: DateString;
};

const validateQuery = (query: ParsedUrlQuery): query is FetchParameter => {
  if (!('kind' in query) || !validateKind(query.kind)) {
    return false;
  }
  if (!('from' in query) || !validateDateString(query.from)) {
    return false;
  }
  if (!('to' in query) || !validateDateString(query.to)) {
    return false;
  }
  return true;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET' || req.url == null) {
    res.status(400).end('Bad Request');
    return;
  }
  const { query } = req;
  if (!validateQuery(query)) {
    res.status(400).end('Bad Request');
    return;
  }

  const { kind, from, to } = query;
  const duration: [Date, Date] = [dateFromString(from), dateFromString(to)];

  FetchService(
    {
      askDurationToFetch: async () => duration,
      show: async meetings => {
        res
          .status(200)
          .end(
            JSON.stringify({ meetings: meetings.filter(m => m.kind === kind) })
          );
      },
    },
    OnMemoryRepository.inst
  );
};
