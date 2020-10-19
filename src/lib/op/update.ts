import { Meeting } from "..";

export type UpdateInput = {
  /**
   * Returns an id of the meeting to update.
   *
   * @returns {Promise<string>} An id of the meeting to update.
   */
  askId(): Promise<string>;
  askParam(): Promise<UpdateParam>;
};

export type UpdateParam = { name?: string; date?: Date };

export type UpdateOutput = {
  /**
   * Returns a meeting from `id`.
   *
   * @param {string} id
   * @returns {Promise<Meeting>} A meeting from `id`.
   */
  find(id: string): Promise<Meeting>;
  /**
   * Overwrites database with `meetings`.
   *
   * @param {...Meeting[]} meetings
   * @returns {Promise<void>} Resolves when done.
   */
  update(...meetings: Meeting[]): Promise<void>;
};

export const UpdateService = async (
  input: UpdateInput,
  output: UpdateOutput,
) => {
  const [id, param] = await Promise.all([input.askId(), input.askParam()]);
  const toUpdate = await output.find(id);
  await output.update({
    ...toUpdate,
    name: param.name || toUpdate.name,
    date: param.date || toUpdate.date,
  });
};
