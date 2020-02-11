import { FetchOutput } from '../op/fetch';
import { CreateOutput } from '../op/create';
import { UpdateOutput } from '../op/update';
import { AbortOutput } from '../op/abort';
import { Meeting, testDatas } from '..';

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

export default OnMemoryRepository.inst;
