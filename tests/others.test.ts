import { CreateService } from '../lib/services/create_service';
import { MeetingKind } from '../lib/meeting';
import { OthersMeeting } from '../lib/entities/other_meeting';

test('その他の集会の登録1', done => {
  const name = 'helloworld2019';
  CreateService(
    {
      askKind: async (): Promise<MeetingKind> => 'Others',
      askName: async (): Promise<string> => name,
      askDate: async () => new Date('2019-04-08'),
      askDuration: async () => [new Date('2019-04-04'), new Date('2019-04-31')],
      modifyByException: async meetings => meetings,
      reportCreatedIds: async id => {},
    },
    {
      save: async (...meetings): Promise<string[]> => {
        expect(meetings).toEqual([
          OthersMeeting.from(name, new Date('2019-04-08')),
        ]);
        done();
        return ['0'];
      },
    }
  );
});
