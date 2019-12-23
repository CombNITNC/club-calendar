import { CreateService } from '../lib/services/create_service';
import { MeetingKind } from '../lib/meeting';
import { RegularMeeting } from '../lib/value_objects/regular_meeting';

const regularName = '定例会';
test('定例会の登録1', done => {
  CreateService(
    {
      askKind: async (): Promise<MeetingKind> => 'Regular',
      askName: async (): Promise<string> => regularName,
      askDate: async () => new Date('2019-04-08'),
      askDuration: async () => [new Date('2019-04-04'), new Date('2019-04-31')],
      modifyByException: async meetings => meetings,
    },
    {
      save: async (...meetings): Promise<void> => {
        expect(meetings).toEqual([
          RegularMeeting.from(regularName, new Date('2019-04-08')),
          RegularMeeting.from(regularName, new Date('2019-04-15')),
          RegularMeeting.from(regularName, new Date('2019-04-22')),
          RegularMeeting.from(regularName, new Date('2019-04-29')),
        ]);
        done();
      },
    }
  );
});

test('定例会の登録2', done => {
  CreateService(
    {
      askKind: async (): Promise<MeetingKind> => 'Regular',
      askName: async (): Promise<string> => regularName,
      askDate: async () => new Date('2019-09-16'),
      askDuration: async () => [new Date('2019-09-24'), new Date('2019-09-30')],
      modifyByException: async meetings => meetings,
    },
    {
      save: async (...meetings): Promise<void> => {
        expect(meetings).toEqual([
          RegularMeeting.from(regularName, new Date('2019-09-30')),
        ]);
        done();
      },
    }
  );
});
