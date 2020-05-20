/**
 * Expresses a range of dates
 *
 * @export
 * @class Duration
 */
export class Duration {
  readonly from: Date;
  readonly to: Date;

  constructor(from: Date, to: Date) {
    if (from.getTime() > to.getTime()) {
      throw new Error('`from` must be before `to`');
    }
    this.from = from;
    this.to = to;
  }
}
