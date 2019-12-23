export type Meeting = {
  name: string,
  date: Date,
  expired: boolean,
};

export const testDatas: Meeting[] = [
  {name: "エイプリルフール", date: new Date(2020, 3, 1), expired: false},
  {name: "こどもの日", date: new Date(2020, 4, 1), expired: false},
];
