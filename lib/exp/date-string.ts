export class DateString {
  public readonly str: string;

  constructor(date: Date) {
    this.str = date.toString();
  }

  static from(str: any) {
    if (typeof str !== 'string' || Date.parse(str) == NaN) {
      throw 'str cannot be converted to Date';
    }
    return new DateString(new Date(str));
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

  toFormValueString() {
    return this.toDate()
      .toISOString()
      .slice(0, 10);
  }
}
