import {
  Meeting,
  Repository,
  MeetingQueryNode,
  transform,
  BoolQuery,
} from '..';

export class OnMemoryRepository implements Repository {
  meetings: Meeting[] = [];
  private incremental: number = 0;

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

  get = async (query: MeetingQueryNode): Promise<Meeting[]> => {
    return this.meetings.filter(m => transform(query, BoolQuery)(m));
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
    const ids = meetings.map(m => m._id);
    const removed = this.meetings.flatMap(m =>
      ids.includes(m._id) ? [] : [m]
    );
    this.meetings = [...removed, ...meetings];
  };
}
