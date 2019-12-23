export type MeetingKind = 'Regular' | 'Others';

export type Meeting = {
  kind: MeetingKind;
  name: string;
  date: Date;
  expired: boolean;
};

export const testDatas: Meeting[] = [
  {
    kind: 'Others',
    name: 'エイプリルフール',
    date: new Date(2020, 3, 1),
    expired: false,
  },
  {
    kind: 'Others',
    name: 'こどもの日',
    date: new Date(2020, 4, 1),
    expired: false,
  },
];
