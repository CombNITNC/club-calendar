import { Meeting, MeetingKind } from '..';

export class RegularMeeting implements Meeting {
  public readonly _id: string = '';
  public readonly name: string = '';
  public readonly date = new Date();
  public readonly expired: boolean = false;
  public readonly kind: MeetingKind = 'Regular';

  private constructor(name: string, date: Date) {
    this.name = name;
    this.date = date;
  }

  static from(name: string, date: Date): Meeting {
    const obj = new RegularMeeting(name, date);
    return obj;
  }
}
