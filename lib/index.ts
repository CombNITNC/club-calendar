export * from './exp/duration';
export * from './exp/meeting';
export * from './exp/date-string';
export * from './exp/year-month';

export * from './abst/meeting-query';
export * from './abst/client';
export * from './abst/repository';

export * from './op/abort';
export * from './op/create';
export * from './op/fetch';
export * from './op/update';

export * from './skin/express';
export * from './skin/on-memory';
export * from './skin/mysql';
export * from './skin/bool-query';
export * from './skin/mysql-query';

import { Meeting } from './exp/meeting';

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
