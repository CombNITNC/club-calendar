import { MeetingQueryNode, Meeting } from '..';

export type FetchInput = {
  /**
   * Returns a query of fecthing.
   *
   * @returns {Promise<MeetingQueryNode>}
   */
  askQuery(): Promise<MeetingQueryNode>;
  /**
   * Presents meetings to an user.
   *
   * @param {Meeting[]} meetings
   * @returns {Promise<void>}
   */
  show(meetings: Meeting[]): Promise<void>;
};

export type FetchOutput = {
  /**
   * Returns meetings from database.
   *
   * @returns {Promise<Meeting[]>}
   */
  get(query: MeetingQueryNode): Promise<Meeting[]>;
};

export const FetchService = async (input: FetchInput, output: FetchOutput) => {
  const query = await input.askQuery();
  const fetched = await output.get(query);
  return input.show(fetched);
};
