/**
 * Expresses a set of an year and a month.
 *
 * @export
 * @class YearMonth
 */
export class YearMonth {
  constructor(public readonly year: number, public readonly month: number) {}

  /**
   * Makes an YearMonth with the next month
   *
   * @returns {YearMonth}
   * @memberof YearMonth
   */
  next(): YearMonth {
    return this.month === 12
      ? new YearMonth(this.year + 1, 1)
      : new YearMonth(this.year, this.month + 1);
  }
  /**
   * Makes an YearMonth with the previous month
   *
   * @returns {YearMonth}
   * @memberof YearMonth
   */
  prev(): YearMonth {
    return this.month === 1
      ? new YearMonth(this.year - 1, 12)
      : new YearMonth(this.year, this.month - 1);
  }

  /**
   * Returns the string of Date
   *
   * @returns {string}
   * @memberof YearMonth
   */
  toString(): string {
    return `${this.year.toString()}-${this.month
      .toString()
      .padStart(2, "0")}-01`;
  }

  /**
   * Makes an YearMonth from the YearMonthQuery
   *
   * @static
   * @param {YearMonthQuery} q
   * @returns {YearMonth}
   * @memberof YearMonth
   */
  static fromQuery(q: YearMonthQuery): YearMonth {
    return new YearMonth(q.y, q.m);
  }
  /**
   * Makes an YearMonthQuery from the YearMonth
   *
   * @returns {YearMonthQuery}
   * @memberof YearMonth
   */
  toQuery(): YearMonthQuery {
    return { y: this.year, m: this.month };
  }
}

export type YearMonthQuery = {
  y: number;
  m: number;
};
