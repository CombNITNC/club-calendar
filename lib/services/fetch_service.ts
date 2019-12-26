import { Meeting } from '../meeting';

export type FetchInput = {
  show(meetings: Meeting[]): Promise<void>;
};

export type FetchOutput = {
  read(): Promise<Meeting[]>;
};

export const FetchService = async (input: FetchInput, output: FetchOutput) => {
  const fetched = await output.read();
  return input.show(fetched);
};
