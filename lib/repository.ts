import { FetchOutput } from './services/FetchService';
import { CreateOutput } from './services/CreateService';
import { UpdateOutput } from './services/UpdateService';
import { AbortOutput } from './services/AbortService';
import { Meeting, testDatas } from './meeting';

export class OnMemoryRepository implements FetchOutput, CreateOutput, UpdateOutput, AbortOutput {
  meetings: Meetings[] = testDatas;
  incremental: number = 0;

  save: async (...meetings: Meeting[]): Promise<string[]> => {
    const addedIds: string[] = [];
    for (const toAdd of meetings) {
      const id = this.incremental.toString();
      addedIds.push(id);
      this.meetings.push({...toAdd, "_id": id.toString()});
      ++this.incremental;
    }
    return addedIds;
  }
  
  read: async (duration: [Date, Date]) Promise<Meeting[]> => {
    const [from, to] = duration;
    return this.meetings.filter(m => from.getTime() <= m.date.getTime() && m.date.getTime() < to.getTime());
  }
  
  update(...meetings: Meeting[]): Promise<void> {
    this.meetings = [...this.meetings, ...meetings];
  }
}

export class RealRepository implements FetchOutput, CreateOutput, UpdateOutput, AbortOutput {
  constructor() {
  }

  save(...meetings: Meeting[]): Promise<string[]> {
  
  }
  
  read(duration: [Date, Date]): Promise<Meeting[]> {
    return [];
  }
  
  update(...meetings: Meeting[]): Promise<void> {
  
  }
}
