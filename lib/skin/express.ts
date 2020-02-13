import { FetchInput } from '../op/fetch';
import { CreateInput } from '../op/create';
import { AbortInput } from '../op/abort';
import { UpdateInput, UpdateParam } from '../op/update';
import { Meeting, Duration, DateString, validateKind } from '..';
import { Request, Response } from 'express';
import { RegularMeeting } from '../exp/regular-meeting';
import { OthersMeeting } from '../exp/other-meeting';

export class ExpressClient
  implements FetchInput, CreateInput, UpdateInput, AbortInput {
  query: { [key: string]: string } = {};
  constructor(private req: Request, private res: Response) {
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
    this.res.setHeader('Content-Type', 'application/json');
    this.res.write(JSON.stringify({ meetings }));
    this.res.end();
  }

  // Create
  async askMeeting(): Promise<Meeting> {
    const { kind, name, date } = this.query;
    if (!validateKind(kind) || name === '' || !DateString.ableTo(date)) {
      throw 'invalid queries';
    }
    if (kind === 'Regular') {
      return RegularMeeting.from(name, new Date(date));
    }
    return OthersMeeting.from(name, new Date(date));
  }
  async askDuration(): Promise<Duration> {
    const { date: dateStr } = this.query;
    if (!DateString.ableTo(dateStr)) {
      throw 'invalid queries';
    }
    const date = DateString.from(dateStr).toDate();
    return [date, date];
  }
  async reportCreatedIds(ids: string[]): Promise<void> {
    this.res.write(JSON.stringify({ ids }));
    this.res.end();
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
