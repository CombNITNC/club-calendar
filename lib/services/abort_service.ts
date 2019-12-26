import { Meeting } from '../meeting';

export type AbortInput = {
  askIdToAbort(): Promise<string>;
};

export type AbortOutput = {
  find(id: string): Promise<Meeting>;
  update(...meetings: Meeting[]): Promise<void>;
};

export const AbortService = async (input: AbortInput, output: AbortOutput) => {
  const id = await input.askIdToAbort();
  const found = await output.find(id);
  output.update({ ...found, expired: true });
};
