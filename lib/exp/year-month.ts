export class YearMonth {
  constructor(public readonly year: number, public readonly month: number) {}

  next(): YearMonth {
    return this.month === 12
      ? new YearMonth(this.year + 1, 1)
      : new YearMonth(this.year, this.month + 1);
  }
  prev(): YearMonth {
    return this.month === 1
      ? new YearMonth(this.year - 1, 12)
      : new YearMonth(this.year, this.month - 1);
  }

  toString(): string {
    return `${this.year.toString()}-${this.month
      .toString()
      .padStart(2, '0')}-01`;
  }

  static fromQuery(q: YearMonthQuery): YearMonth {
    return new YearMonth(q.y, q.m);
  }
  toQuery(): YearMonthQuery {
    return { y: this.year, m: this.month };
  }
}

export type YearMonthQuery = {
  y: number;
  m: number;
};
