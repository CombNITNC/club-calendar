import { MeetingQueryNode, Meeting } from '..';

export type FetchInput = {
  /**
   * Returns a query of fecthing.
   *
   * @returns {Promise<MeetingQueryNode>} A query of fecthing.
   */
  askQuery(): Promise<MeetingQueryNode>;
  /**
   * Presents meetings to an user.
   *
   * @param {Meeting[]} meetings
   * @returns {Promise<void>} Resolves when done.
   */
  show(meetings: Meeting[]): Promise<void>;
};

export type FetchOutput = {
  /**
   * Returns meetings from database.
   *
   * @returns {Promise<Meeting[]>} Meetings from database.
   */
  get(query: MeetingQueryNode): Promise<Meeting[]>;
};

export const FetchService = async (input: FetchInput, output: FetchOutput) => {
  const query = await input.askQuery();
  const fetched = await output.get(query);
  return input.show(fetched);
};
