import { CreateService } from '../services/create_service';
import { OthersMeeting } from '../entities/other_meeting';
import { UpdateService } from '../services/update_service';
import { AbortService } from '../services/abort_service';

test('その他の集会の登録1', done => {
  const name = 'helloworld2019';
  CreateService(
    {
      askMeeting: async () => OthersMeeting.from(name, new Date('2019-04-08')),
      askDuration: async () => [new Date('2019-04-04'), new Date('2019-04-31')],
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

test('その他の集会の更新1', done => {
  UpdateService(
    { askId: async () => 'hoge', askParam: async () => ({ name: 'ホゲ談義' }) },
    {
      find: async id => ({
        kind: 'Others',
        name: 'ホゲホゲ談義',
        date: new Date('2019-09-30T16:15:00'),
        expired: false,
      }),
      update: async meeting => {
        expect(meeting).toEqual({
          kind: 'Others',
          name: 'ホゲ談義',
          date: new Date('2019-09-30T16:15:00'),
          expired: false,
        });
        done();
      },
    }
  );
});

test('その他の集会の中止1', done => {
  AbortService(
    { askIdToAbort: async () => 'hoge' },
    {
      find: async id => ({
        kind: 'Others',
        name: 'ホゲ談義',
        date: new Date('2019-09-30T16:15:00'),
        expired: false,
      }),
      update: async meeting => {
        expect(meeting).toEqual({
          kind: 'Others',
          name: 'ホゲ談義',
          date: new Date('2019-09-30T16:15:00'),
          expired: true,
        });
        done();
      },
    }
  );
});
