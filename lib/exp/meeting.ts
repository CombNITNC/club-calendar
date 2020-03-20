import hash from 'object-hash';

export type MeetingKind = 'Regular' | 'Others';

export const validateKind = (str: any): str is MeetingKind =>
  str === 'Regular' || str === 'Others';

/**
 * Expresses a meeting's name, date, kind and expired
 *
 * @export
 * @class Meeting
 */
export class Meeting {
  readonly _id: string;
  kind: MeetingKind;
  name: string;
  date: Date;
  expired: boolean;

  private constructor(name: string, date: Date, kind: MeetingKind) {
    this._id = hash({ name, date, kind });
    this.name = name;
    this.date = date;
    this.kind = kind;
    this.expired = false;
  }

  /**
   * Creates a Meeting, the kind of regular
   *
   * @static
   * @param {string} name
   * @param {Date} date
   * @returns {Meeting} A Meeting, the kind of regular
   * @memberof Meeting
   */
  static regular(name: string, date: Date): Meeting {
    return new Meeting(name, date, 'Regular');
  }
  /**
   * Creates a Meeting, the kind of others
   *
   * @static
   * @param {string} name
   * @param {Date} date
   * @returns {Meeting} A Meeting, the kind of others
   * @memberof Meeting
   */
  static others(name: string, date: Date): Meeting {
    return new Meeting(name, date, 'Others');
  }

  /**
   * Make a SerializedMeeting from the Meeting
   *
   * @static
   * @param {Meeting} meeting
   * @returns {SerializedMeeting}
   * @memberof Meeting
   */
  static serialize(meeting: Meeting): SerializedMeeting {
    const serial = {
      ...meeting,
      id: meeting._id,
      date: meeting.date.toUTCString(),
    };
    delete serial._id;
    return serial;
  }

  /**
   * Make a Meeting from the SerializedMeeting
   *
   * @static
   * @param {SerializedMeeting} s
   * @returns {Meeting}
   * @memberof Meeting
   */
  static deserialize(s: SerializedMeeting): Meeting {
    const deserial = {
      ...s,
      _id: s.id,
      date: new Date(s.date),
    };
    delete deserial.id;
    return deserial;
  }
}

export type SerializedMeeting = {
  readonly id: string;
  readonly kind: MeetingKind;
  readonly name: string;
  readonly date: string;
  readonly expired: boolean;
};
