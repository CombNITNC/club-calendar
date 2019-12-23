import { Meeting, MeetingKind } from '../meeting';
import { OthersMeeting } from '../value_objects/other_meeting';
import { RegularMeeting } from '../value_objects/regular_meeting';

export type CreateInput = {
  askKind(): Promise<MeetingKind>;
  askName(): Promise<string>;
  askDate(): Promise<Date>;
  askDuration(): Promise<[Date, Date]>;
  modifyByException(meetings: Meeting[]): Promise<Meeting[]>;
};

export type CreateOutput = {
  save(...meetings: Meeting[]): Promise<void>;
};

export const CreateService = async (
  input: CreateInput,
  output: CreateOutput
) => {
  const kind = await input.askKind();
  if (kind == 'Others') {
    const name = await input.askName();
    const date = await input.askDate();
    const others = OthersMeeting.from(name, date);
    output.save(others);
    return;
  }

  const name = await input.askName();
  const date = await input.askDate();
  const [start, end] = await input.askDuration();
  const regulars: Meeting[] = [];
  if (date.getTime() < start.getTime()) {
    const day = date.getDate();
    date.setTime(start.getTime());
    date.setDate(day < start.getDate() ? day + 1 : day);
  }
  for (; date.getTime() > end.getTime(); date.setDate(date.getDate() + 7)) {
    regulars.push(RegularMeeting.from(name, new Date(date)));
  }
  output.save(...regulars);
};
