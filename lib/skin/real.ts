import { FetchOutput } from '../op/fetch';
import { CreateOutput } from '../op/create';
import { UpdateOutput } from '../op/update';
import { AbortOutput } from '../op/abort';
import { Meeting } from '..';
import { GetMeetings } from '../../db/meetings';

export class RealRepository
  implements FetchOutput, CreateOutput, UpdateOutput, AbortOutput {
  static readonly inst = new RealRepository();

  private constructor(private Meetings = GetMeetings()) {}

  async save(...meetings: Meeting[]): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.Meetings.insertMany(
        meetings.map(m => ({ ...m, date: m.date.getTime() })),
        (e, res) => {
          if (e != null) reject(e);
          else resolve(res.map(m => m._id));
        }
      );
    });
  }

  async getAll(): Promise<Meeting[]> {
    return (await this.Meetings.find({})).map(d => ({
      ...d,
      date: new Date(d.date),
    }));
  }

  async read(duration: [Date, Date]): Promise<Meeting[]> {
    const [from, to] = duration;
    return new Promise((resolve, reject) => {
      this.Meetings.find({ date: { $gte: from, $lte: to } }, (e, res) => {
        if (e != null) reject(e);
        else resolve(res.map(d => ({ ...d, date: new Date(d.date) })));
      });
    });
  }

  async find(id: string): Promise<Meeting> {
    const found = await this.Meetings.findOne({ _id: id });
    if (found == null) {
      throw 'the meeting has not found';
    }
    return {
      _id: id,
      name: found.name,
      date: new Date(found.date),
      kind: found.kind,
      expired: found.expired,
    };
  }

  async update(...meetings: Meeting[]): Promise<void> {
    for (const m of meetings) {
      const { _id, ...others } = m;
      const doc = { ...others, date: others.date.getTime() };
      await this.Meetings.replaceOne({ _id }, doc);
    }
  }
}

export default RealRepository.inst;
