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
   * Creates a Date.
   *
   * @returns
   * @memberof DateString
   */
  toDate() {
    return new Date(this.str);
  }

  /**
   * Creates a DateString from a string `str`
   *
   * @static
   * @param {*} str
   * @returns
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
   * @returns {boolean}
   * @memberof DateString
   */
  static ableTo(str: any): boolean {
    return typeof str === 'string' && Date.parse(str) != NaN;
  }
}
