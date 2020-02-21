import { Meeting } from '..';

export type FetchInput = {
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
  getAll(): Promise<Meeting[]>;
};

export const FetchService = async (input: FetchInput, output: FetchOutput) => {
  const fetched = await output.getAll();
  return input.show(fetched);
};
