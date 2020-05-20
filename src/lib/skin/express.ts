import {
  UpdateParam,
  Client,
  Meeting,
  Duration,
  DateString,
  MeetingQueryNode,
  validateKind,
} from '..';
import { Request, Response } from 'express';

export class ExpressClient implements Client {
  query: { [key: string]: string } = {};
  constructor(req: Request, private res: Response) {
    const { query } = req;
    if (typeof query === 'object') {
      for (const [k, v] of Object.entries(query)) {
        if (typeof v !== 'string') continue;
        this.query[k] = v;
      }
    }

    const { params } = req;
    if (typeof params === 'object') {
      for (const [k, v] of Object.entries(params)) {
        if (typeof v !== 'string') continue;
        this.query[k] = v;
      }
    }

    const { body } = req;
    if (typeof body === 'object') {
      for (const [k, v] of Object.entries(body)) {
        if (typeof v !== 'string') continue;
        this.query[k] = v;
      }
    }
  }

  // Fetch
  async askQuery(): Promise<MeetingQueryNode> {
    const queries: MeetingQueryNode[] = [];
    if ('id' in this.query && typeof this.query.id === 'string') {
      queries.push(['isId', this.query.id]);
    }
    if ('kind' in this.query && validateKind(this.query.kind)) {
      queries.push(['isKind', this.query.kind]);
    }
    if ('from' in this.query && DateString.ableTo(this.query.from)) {
      const date = DateString.to(this.query.from).toDate();
      queries.push(['holdAfter', date]);
    }
    if ('to' in this.query && DateString.ableTo(this.query.to)) {
      const date = DateString.to(this.query.to).toDate();
      queries.push(['holdBefore', date]);
    }
    if (
      'expired' in this.query &&
      (this.query.expired === 'true' || this.query.expired === 'false')
    ) {
      queries.push(['isExpired', this.query.expired === 'true']);
    }
    if (queries.length <= 0) return ['everything'];
    return queries.reduce((prev, q) => ['and', prev, q]);
  }

  async show(meetings: Meeting[]): Promise<void> {
    const payload = meetings.map(m => {
      const p = { ...m, date: m.date.toString() };
      delete p._id;
      return { ...p, id: m._id };
    });
    this.res.send({
      meetings: payload,
    });
  }

  // Create
  async askMeeting(): Promise<Meeting> {
    const { kind, name } = this.query;
    if (!validateKind(kind)) {
      throw `invalid kind: ${kind}`;
    }
    if (kind === 'Regular') {
      const { from, to } = this.query;
      if (name === '' || !DateString.ableTo(from) || !DateString.ableTo(to)) {
        console.error(this.query);
        throw new Error('invalid queries for regular');
      }

      return Meeting.regular(name, new Date(from));
    }
    if (kind === 'Others') {
      const { date } = this.query;
      if (name === '' || !DateString.ableTo(date)) {
        console.error(this.query);
        throw new Error('invalid queries for others');
      }

      return Meeting.others(name, new Date(date));
    }
    console.error(this.query);
    throw new Error('invalid queries');
  }
  async askDuration(): Promise<Duration> {
    const { kind, date: dateStr } = this.query;
    if (kind === 'Regular') {
      const { from, to } = this.query;
      return new Duration(new Date(from), new Date(to));
    }

    const date = DateString.to(dateStr).toDate();
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
