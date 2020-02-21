import { Meeting, Duration } from '..';

export type CreateInput = {
  /**
   * Returns a meeting to add to database.
   *
   * @returns {Promise<Meeting>}
   */
  askMeeting(): Promise<Meeting>;
  /**
   * Returns a duration of to add meetings.
   *
   * @returns {Promise<Duration>}
   */
  askDuration(): Promise<Duration>;
  /**
   * Presents created ids to an user.
   *
   * @param {string[]} ids
   * @returns {Promise<void>}
   */
  reportCreatedIds(ids: string[]): Promise<void>;
};

export type CreateOutput = {
  /**
   * Saves meetings to database.
   *
   * @param {...Meeting[]} meetings
   * @returns {Promise<string[]>}
   */
  save(...meetings: Meeting[]): Promise<string[]>;
};

export const CreateService = async (
  input: CreateInput,
  output: CreateOutput
) => {
  const meeting = await input.askMeeting();
  if (meeting.kind === 'Others') {
    const ids = await output.save(meeting);
    input.reportCreatedIds(ids);
    return;
  }

  const { name, date } = meeting;
  const { from: start, to: end } = await input.askDuration();
  const regulars: Meeting[] = [];
  while (date.getDate() < start.getDate()) {
    date.setDate(date.getDate() + 7);
  }
  for (; date.getTime() <= end.getTime(); date.setDate(date.getDate() + 7)) {
    regulars.push(Meeting.regular(name, new Date(date)));
  }
  const ids = await output.save(...regulars);
  input.reportCreatedIds(ids);
};
