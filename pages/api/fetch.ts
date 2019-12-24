import { FetchService } from '../../lib/services/fetch_service';
import { MeetingKind, testDatas } from '../../lib/meeting';
import { ParsedUrlQuery } from 'querystring';
import { NextApiRequest, NextApiResponse } from 'next';

type DateString = string;

export type FetchParameter = {
  kind: MeetingKind;
  from: DateString;
  to: DateString;
};

const validateKind = (str: any): str is MeetingKind =>
  str === 'Regular' || str === 'Others';

const validateDateString = (str: any): str is DateString =>
  typeof str === 'string' && Date.parse(str) != NaN;

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

const dateFromString = (str: DateString) => new Date(str);

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
    {
      read: async (duration: [Date, Date]) => {
        return testDatas;
      },
    }
  );
};
