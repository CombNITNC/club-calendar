export type MeetingQuery<T> = {
  isId(id: string): T;
  named(name: string): T;
  holdBefore(date: Date): T;
  holdAfter(date: Date): T;
  isExpired(isExpired: boolean): T;
  and(left: T, right: T): T;
  or(left: T, right: T): T;
  not(right: T): T;
};
