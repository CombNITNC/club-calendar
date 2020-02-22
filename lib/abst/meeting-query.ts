import { MeetingKind } from '../exp/meeting';

export type MeetingQuery<T> = {
  everything(): T;
  isId(id: string): T;
  named(name: string): T;
  isKind(kind: MeetingKind): T;
  holdBefore(date: Date): T;
  holdAfter(date: Date): T;
  isExpired(isExpired: boolean): T;
  and(left: T, right: T): T;
  or(left: T, right: T): T;
  not(right: T): T;
};

export type MeetingQueryNode =
  | ['everything']
  | ['isId', string]
  | ['named', string]
  | ['isKind', MeetingKind]
  | ['holdBefore', Date]
  | ['holdAfter', Date]
  | ['isExpired', boolean]
  | ['and', MeetingQueryNode, MeetingQueryNode]
  | ['or', MeetingQueryNode, MeetingQueryNode]
  | ['not', MeetingQueryNode];

export function transform<
  T extends MeetingQuery<U>,
  U = T extends MeetingQuery<infer V> ? V : never
>(node: MeetingQueryNode, target: T): U {
  switch (node[0]) {
    case 'everything':
      return target.everything();
    case 'isId':
      return target.isId(node[1]);
    case 'named':
      return target.named(node[1]);
    case 'isKind':
      return target.isKind(node[1]);
    case 'holdBefore':
      return target.holdBefore(node[1]);
    case 'holdAfter':
      return target.holdAfter(node[1]);
    case 'isExpired':
      return target.isExpired(node[1]);
    case 'and':
      return target.and(transform(node[1], target), transform(node[2], target));
    case 'or':
      return target.or(transform(node[1], target), transform(node[2], target));
    case 'not':
      return target.not(transform(node[1], target));
  }
}
