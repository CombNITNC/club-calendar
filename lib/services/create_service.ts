import { Meeting, MeetingKind } from '../meeting';
import { OthersMeeting } from '../entities/other_meeting';
import { RegularMeeting } from '../entities/regular_meeting';

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
  if (kind === 'Others') {
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
  while (date.getDate() < start.getDate()) {
    date.setDate(date.getDate() + 7);
  }
  for (; date.getTime() <= end.getTime(); date.setDate(date.getDate() + 7)) {
    regulars.push(RegularMeeting.from(name, new Date(date)));
  }
  output.save(...regulars);
};
