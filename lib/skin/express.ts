import {
  UpdateParam,
  Client,
  Meeting,
  Duration,
  DateString,
  validateKind,
} from '..';
import { Request, Response } from 'express';

export class ExpressClient implements Client {
  query: { [key: string]: string } = {};
  constructor(req: Request, private res: Response) {
    const query = req.query;
    if (typeof query === 'object') {
      for (const [k, v] of Object.entries(query)) {
        if (typeof v !== 'string') continue;
        this.query[k] = v;
      }
    }

    const params = req.params;
    if (typeof params === 'object') {
      for (const [k, v] of Object.entries(params)) {
        if (typeof v !== 'string') continue;
        this.query[k] = v;
      }
    }
  }

  // Fetch
  async show(meetings: Meeting[]): Promise<void> {
    this.res.send({
      meetings: meetings.map(m => ({ ...m, date: m.date.toString() })),
    });
  }

  // Create
  async askMeeting(): Promise<Meeting> {
    const { kind, name, date } = this.query;
    if (!validateKind(kind) || name === '' || !DateString.ableTo(date)) {
      throw 'invalid queries';
    }
    if (kind === 'Regular') {
      return Meeting.regular(name, new Date(date));
    }
    return Meeting.others(name, new Date(date));
  }
  async askDuration(): Promise<Duration> {
    const { date: dateStr } = this.query;
    if (!DateString.ableTo(dateStr)) {
      throw 'invalid queries';
    }
    const date = DateString.from(dateStr).toDate();
    return new Duration(date, date);
  }
  async reportCreatedIds(ids: string[]): Promise<void> {
    this.res.send({ ids });
  }

  // Update
  async askId(): Promise<string> {
    return this.query.id;
  }
  async askParam(): Promise<UpdateParam> {
    const { name, date } = this.query;
    return { name, date: new Date(date) };
  }

  // Abort
  async askIdToAbort(): Promise<string> {
    return this.query.id;
  }
}
