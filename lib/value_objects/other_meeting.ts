import { Meeting, MeetingKind } from '../meeting';

export class OthersMeeting {
  name = '';
  date = new Date();
  expired = false;
  kind: MeetingKind = 'Others';

  static from(name: string, date: Date): Meeting {
    const obj = new OthersMeeting();
    obj.name = name;
    obj.date = date;
    return obj;
  }
}
