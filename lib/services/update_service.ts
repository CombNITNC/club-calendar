import { Meeting } from '../meeting';

export type UpdateInput = {
  askId(): Promise<string>;
  askParam(): Promise<UpdateParam>;
};

export type UpdateParam = { name?: string; date?: Date };

export type UpdateOutput = {
  find(id: string): Promise<Meeting>;
  update(...meetings: Meeting[]): Promise<void>;
};

export const UpdateService = async (
  input: UpdateInput,
  output: UpdateOutput
) => {
  const [id, param] = await Promise.all([input.askId(), input.askParam()]);
  const toUpdate = await output.find(id);
  output.update({
    ...toUpdate,
    name: param.name || toUpdate.name,
    date: param.date || toUpdate.date,
  });
};
