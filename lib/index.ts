import { AbortInput, AbortOutput } from './op/abort';
import { CreateInput, CreateOutput } from './op/create';
import { FetchInput, FetchOutput } from './op/fetch';
import { UpdateInput, UpdateOutput } from './op/update';
import { Meeting } from './exp/meeting';

export * from './exp/duration';
export * from './exp/meeting';
export * from './exp/date-string';

export type Client = AbortInput & CreateInput & FetchInput & UpdateInput;
export type Repository = AbortOutput &
  CreateOutput &
  FetchOutput &
  UpdateOutput;

export * from './op/abort';
export * from './op/create';
export * from './op/fetch';
export * from './op/update';

export * from './skin/express';
export * from './skin/on-memory';
export * from './skin/mysql';

export const testDatas: Meeting[] = [
  {
    _id: 'xxxx',
    kind: 'Others',
    name: 'エイプリルフール',
    date: new Date('2020-04-01'),
    expired: false,
  },
  {
    _id: 'yyyy',
    kind: 'Others',
    name: 'こどもの日',
    date: new Date('2020-05-05'),
    expired: false,
  },
  {
    _id: 'zzzz',
    kind: 'Regular',
    name: '第一回定例会',
    date: new Date('2020-04-06'),
    expired: false,
  },
];
