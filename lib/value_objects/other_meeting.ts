import { Meeting, MeetingKind } from '../meeting';

export class OthersMeeting {
  _id = '';
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
