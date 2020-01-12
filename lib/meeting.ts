export type MeetingKind = 'Regular' | 'Others';

export type Meeting = {
  _id: string;
  kind: MeetingKind;
  name: string;
  date: Date;
  expired: boolean;
};

export class DateString {
  private readonly str: string;

  constructor(date: Date) {
    this.str = date.toString();
  }

  toDate() {
    return new Date(this.str);
  }

  static to(obj: any): DateString {
    if (!this.ableTo(obj)) {
      throw 'obj cannot convert to DateString';
    }
    const str = new DateString(new Date(obj));
    return str;
  }

  static ableTo(obj: any): boolean {
    return typeof obj === 'string' && Date.parse(obj) != NaN;
  }
}

export const validateKind = (str: any): str is MeetingKind =>
  str === 'Regular' || str === 'Others';

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
