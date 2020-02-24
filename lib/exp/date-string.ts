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
   * Creates a DateString from a string `str`
   *
   * @static
   * @param {*} str
   * @returns {DateString} A DateString from a string `str`
   * @memberof DateString
   */
  static to(str: any): DateString {
    if (!this.ableTo(str)) {
      throw 'obj cannot convert to DateString';
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
