import { Meeting, MeetingKind } from '../meeting';

export class OthersMeeting implements Meeting {
  private _id: string = '';
  public readonly name: string = '';
  public readonly date = new Date();
  public readonly expired: boolean = false;
  public readonly kind: MeetingKind = 'Others';

  private constructor(name: string, date: Date) {
    this.name = name;
    this.date = date;
  }

  static from(name: string, date: Date): Meeting {
    const obj = new OthersMeeting(name, date);
    return obj;
  }
}
