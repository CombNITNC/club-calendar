import { MeetingQuery, Meeting } from "..";

type BoolQueryNode = (meeting: Meeting) => boolean;

export const BoolQuery: MeetingQuery<BoolQueryNode> = {
  everything: () => () => true,
  isId: (id) => (m) => id === m.id,
  named: (name) => (m) => name === m.name,
  isKind: (kind) => (m) => kind === m.kind,
  holdBefore: (date) => (m) => m.date.getTime() <= date.getTime(),
  holdAfter: (date) => (m) => m.date.getTime() >= date.getTime(),
  isExpired: (isExpired) => (m) => m.expired == isExpired,
  and: (left, right) => (m) => left(m) && right(m),
  or: (left, right) => (m) => left(m) || right(m),
  not: (right) => (m) => !right(m),
};
