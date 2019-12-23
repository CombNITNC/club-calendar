import { Meeting } from '../meeting';

export type AbortInput = {
  askDurationToAbort(): Promise<[Date, Date]>;
};

export type AbortOutput = {
  read(duration: [Date, Date]): Promise<Meeting[]>;
  update(...meetings: Meeting[]): Promise<void>;
};

export const AbortService = async (input: AbortInput, output: AbortOutput) => {
  const duration = await input.askDurationToAbort();
  const abortNeeds: Meeting[] = [];
  for (const toAbort of await output.read(duration)) {
    abortNeeds.push({ ...toAbort, expired: true });
  }
  output.update(...abortNeeds);
};
