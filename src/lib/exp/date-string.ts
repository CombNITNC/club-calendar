/**
 * Expresses a string of Date
 *
 * @export
 * @class DateString
 */
export class DateString {
  public readonly str: string;

  constructor(date: Date) {
    this.str = date.toString();
  }

  /**
   * Creates a Date from this.str.
   *
   * @returns {Date} A Date from this.str.
   * @memberof DateString
   */
  toDate() {
    return new Date(this.str);
  }

  /**
   * Convert to a string for input, kind of datetime-local
   *
   * @returns {string} A value of <input type="datetime-local" />
   * @memberof DateString
   */
  toDatetimeLocal() {
    const shift = this.toDate().getTime() + 9 * 60 * 60 * 1000;
    const time = new Date(shift).toISOString().split('.')[0];
    return time;
  }

  /**
   * Convert to a string for input, kind of date and time
   *
   * @returns {string} A value of <input type="date" /> and <input type="time" />
   * @memberof DateString
   */
  toDateTimeStrings(): { date: string; time: string } {
    const datetimeLocal = this.toDatetimeLocal();
    const [date, time] = datetimeLocal.split('T');
    return { date, time };
  }

  static fromDateTimeStrings({
    date: dateStr,
    time: timeStr,
  }: {
    date: string;
    time: string;
  }): DateString {
    const date = new Date(`${dateStr}T${timeStr}`);
    const obj = new DateString(date);
    return obj;
  }

  /**
   * Creates a DateString from a string `str`
   *
   * @static
   * @param {*} str
   * @returns {DateString} A DateString from a string `str`
   * @memberof DateString
   */
  static to(str: any): DateString {
    if (!this.ableTo(str)) {
      throw new Error('obj cannot convert to DateString');
    }
    const obj = new DateString(new Date(str));
    return obj;
  }

  /**
   * Returns whether `str` can convert to a DateString.
   *
   * @static
   * @param {*} str
   * @returns {boolean} Whether `str` can convert to a DateString.
   * @memberof DateString
   */
  static ableTo(str: any): boolean {
    return typeof str === 'string' && Date.parse(str) != NaN;
  }
}
