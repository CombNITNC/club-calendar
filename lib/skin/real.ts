import { Meeting, Duration, Repository } from '..';
import { GetMeetings } from '../../db/meetings';
import { MeetingKind } from '../exp/meeting';

type Param = [string, MeetingKind, string, Date, boolean];

const toParam = (m: Meeting): Param => [
  m._id,
  m.kind,
  m.name,
  m.date,
  m.expired,
];

const fromParam = (p: Param): Meeting => ({
  _id: p[0],
  kind: p[1],
  name: p[2],
  date: p[3],
  expired: p[4],
});

export class RealRepository implements Repository {
  constructor(private Meetings = GetMeetings()) {}

  save(...meetings: Meeting[]): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const params = meetings.reduce(
        (prev, curr) => [...prev, toParam(curr)],
        [] as Param[]
      );
      this.Meetings.query(
        'INSERT INTO `meetings` (id, kind, name, date, expired) VALUES ?',
        params,
        (e, results: Param[]) =>
          e ? reject(e) : resolve(results.map(p => p[0][0]))
      );
    });
  }

  getAll(): Promise<Meeting[]> {
    return new Promise((resolve, reject) => {
      this.Meetings.query('SELECT * FROM `meetings`', (e, results: Param[]) =>
        e ? reject(e) : resolve(results.map(fromParam))
      );
    });
  }

  read(duration: Duration): Promise<Meeting[]> {
    const { from, to } = duration;
    return new Promise((resolve, reject) => {
      this.Meetings.query(
        'SELECT * FROM `meetings` WHERE `date` BETWEEN ? AND ?',
        [from, to],
        (e, results: Param[]) =>
          e ? reject(e) : resolve(results.map(fromParam))
      );
    });
  }

  find(id: string): Promise<Meeting> {
    return new Promise((resolve, reject) => {
      this.Meetings.query(
        'SELECT * FROM `meetings` WHERE `id` = ?',
        [id],
        (e, results: Param[]) => {
          if (e) reject(e);
          const found = results.map(fromParam);
          if (found.length != 1) reject('no such mettings found');
          resolve(found[0]);
        }
      );
    });
  }

  async update(...meetings: Meeting[]): Promise<void> {
    await Promise.all(
      meetings.map(
        m =>
          new Promise((resolve, reject) => {
            this.Meetings.query(
              'UPDATE `meetings` SET ? WHERE `id` = ?',
              [toParam(m), m._id],
              e => (e ? reject(e) : resolve())
            );
          })
      )
    );
  }
}
