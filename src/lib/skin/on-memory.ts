import {
  Meeting,
  Repository,
  MeetingQueryNode,
  transform,
  BoolQuery,
} from "..";

export class OnMemoryRepository implements Repository {
  meetings: Meeting[] = [];
  private incremental = 0;

  save = async (...meetings: Meeting[]): Promise<string[]> => {
    const addedIds: string[] = [];
    for (const toAdd of meetings) {
      const id = this.incremental.toString();
      addedIds.push(id);
      this.meetings.push({ ...toAdd, id: id });
      ++this.incremental;
    }
    return addedIds;
  };

  get = async (query: MeetingQueryNode): Promise<Meeting[]> => {
    return this.meetings.filter((m) => transform(query, BoolQuery)(m));
  };

  find = async (id: string): Promise<Meeting> => {
    const found = this.meetings.find((m) => m.id === id);
    if (found == null) throw new Error("Illegal id");
    return found;
  };

  read = async (): Promise<Meeting[]> => {
    return this.meetings;
  };

  update = async (...meetings: Meeting[]): Promise<void> => {
    const ids = meetings.map((m) => m.id);
    const removed = this.meetings.flatMap((m) =>
      ids.includes(m.id) ? [] : [m],
    );
    this.meetings = [...removed, ...meetings];
  };
}
