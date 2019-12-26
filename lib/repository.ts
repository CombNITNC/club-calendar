import { FetchOutput } from './services/fetch_service';
import { CreateOutput } from './services/create_service';
import { UpdateOutput } from './services/update_service';
import { AbortOutput } from './services/abort_service';
import { Meeting, testDatas } from './meeting';

export class OnMemoryRepository
  implements FetchOutput, CreateOutput, UpdateOutput, AbortOutput {
  static readonly inst = new OnMemoryRepository();

  private constructor() {}

  meetings: Meeting[] = testDatas;
  incremental: number = 0;

  save = async (...meetings: Meeting[]): Promise<string[]> => {
    const addedIds: string[] = [];
    for (const toAdd of meetings) {
      const id = this.incremental.toString();
      addedIds.push(id);
      this.meetings.push({ ...toAdd, _id: id });
      ++this.incremental;
    }
    return addedIds;
  };

  getAll = async (): Promise<Meeting[]> => {
    return this.meetings;
  };

  find = async (id: string): Promise<Meeting> => {
    const found = this.meetings.find(m => m._id === id);
    if (found == null) throw 'Illegal id';
    return found;
  };

  read = async (): Promise<Meeting[]> => {
    return this.meetings;
  };

  update = async (...meetings: Meeting[]): Promise<void> => {
    this.meetings = [...this.meetings, ...meetings];
  };
}

export class RealRepository
  implements FetchOutput, CreateOutput, UpdateOutput, AbortOutput {
  constructor() {}

  async save(...meetings: Meeting[]): Promise<string[]> {
    return [];
  }

  async getAll(): Promise<Meeting[]> {
    return [];
  }

  async read(duration: [Date, Date]): Promise<Meeting[]> {
    return [];
  }

  async find(id: string): Promise<Meeting> {
    return { kind: 'Others', name: '', date: new Date(), expired: true };
  }

  async update(...meetings: Meeting[]): Promise<void> {}
}
