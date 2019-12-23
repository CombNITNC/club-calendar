import { Meeting, MeetingKind } from '../meeting';

export class RegularMeeting {
  name = '';
  date = new Date();
  expired = false;
  kind: MeetingKind = 'Regular';

  static from(name: string, date: Date): Meeting {
    const obj = new RegularMeeting();
    obj.name = name;
    obj.date = date;
    return obj;
  }
}
