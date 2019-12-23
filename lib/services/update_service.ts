import { Meeting } from '../meeting';

export type UpdateInput = {
  askDurationToUpdate(): Promise<[Date, Date]>;
  askName(): Promise<string>;
  askDate(): Promise<Date>;
};

export type UpdateOutput = {
  read(duration: [Date, Date]): Promise<Meeting[]>;
  update(...meetings: Meeting[]): Promise<void>;
};

export const UpdateService = async (
  input: UpdateInput,
  output: UpdateOutput
) => {
  const duration = await input.askDurationToUpdate();
  const updateNeeds: Meeting[] = [];
  for (const toUpdate of await output.read(duration)) {
    if (toUpdate.kind === 'Regular') {
      const date = await input.askDate();
      updateNeeds.push({ ...toUpdate, date });
      continue;
    }
    const name = await input.askName();
    const date = await input.askDate();
    updateNeeds.push({ ...toUpdate, name, date });
  }
  output.update(...updateNeeds);
};
