import { CreateService } from '../lib/services/create_service';
import { MeetingKind } from '../lib/meeting';
import { RegularMeeting } from '../lib/value_objects/regular_meeting';

const regularName = '定例会';
test('定例会の登録1', done => {
  CreateService(
    {
      askKind: async (): Promise<MeetingKind> => 'Regular',
      askName: async (): Promise<string> => regularName,
      askDate: async () => new Date(2019, 3, 8),
      askDuration: async () => [new Date(2019, 3, 4), new Date(2019, 3, 31)],
      modifyByException: async meetings => meetings,
    },
    {
      save: async (...meetings): Promise<void> => {
        expect(meetings).toEqual([
          RegularMeeting.from(regularName, new Date(2019, 3, 8)),
          RegularMeeting.from(regularName, new Date(2019, 3, 15)),
          RegularMeeting.from(regularName, new Date(2019, 3, 22)),
          RegularMeeting.from(regularName, new Date(2019, 3, 29)),
        ]);
        done();
      },
    }
  );
});
