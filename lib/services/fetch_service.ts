import { Meeting } from '../meeting';

export type FetchInput = {
  askDurationToFetch(): Promise<[Date, Date]>;
  show(meetings: Meeting[]): Promise<void>;
};

export type FetchOutput = {
  read(duration: [Date, Date]): Promise<Meeting[]>;
};

export const FetchService = async (input: FetchInput, output: FetchOutput) => {
  const duration = await input.askDurationToFetch();
  const fetched = await output.read(duration);
  return input.show(fetched);
};
