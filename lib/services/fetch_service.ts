import { Meeting } from '../meeting';

export type FetchInput = {
  show(meetings: Meeting[]): Promise<void>;
};

export type FetchOutput = {
  getAll(): Promise<Meeting[]>;
};

export const FetchService = async (input: FetchInput, output: FetchOutput) => {
  const fetched = await output.getAll();
  return input.show(fetched);
};
