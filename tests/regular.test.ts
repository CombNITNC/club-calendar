import { CreateService } from '../lib/services/create_service';
import { RegularMeeting } from '../lib/entities/regular_meeting';
import { UpdateService } from '../lib/services/update_service';
import { AbortService } from '../lib/services/abort_service';

const regularName = '定例会';
test('定例会の登録1', done => {
  CreateService(
    {
      askMeeting: async () =>
        RegularMeeting.from(regularName, new Date('2019-04-08')),
      askDuration: async () => [new Date('2019-04-04'), new Date('2019-04-31')],
      reportCreatedIds: async id => {},
    },
    {
      save: async (...meetings): Promise<string[]> => {
        expect(meetings).toEqual([
          RegularMeeting.from(regularName, new Date('2019-04-08')),
          RegularMeeting.from(regularName, new Date('2019-04-15')),
          RegularMeeting.from(regularName, new Date('2019-04-22')),
          RegularMeeting.from(regularName, new Date('2019-04-29')),
        ]);
        done();
        return new Array(4).map(n => n.toString());
      },
    }
  );
});

test('定例会の登録2', done => {
  CreateService(
    {
      askMeeting: async () =>
        RegularMeeting.from(regularName, new Date('2019-09-16')),
      askDuration: async () => [new Date('2019-09-24'), new Date('2019-09-30')],
      reportCreatedIds: async ids => {},
    },
    {
      save: async (...meetings): Promise<string[]> => {
        expect(meetings).toEqual([
          RegularMeeting.from(regularName, new Date('2019-09-30')),
        ]);
        done();
        return ['0'];
      },
    }
  );
});

test('定例会の更新1', done => {
  UpdateService(
    { askId: async () => 'hoge', askParam: async () => ({ name: 'ホゲ談義' }) },
    {
      find: async id => ({
        kind: 'Regular',
        name: 'ホゲホゲ談義',
        date: new Date('2019-09-30T16:15:00'),
        expired: false,
      }),
      update: async meeting => {
        expect(meeting).toEqual({
          kind: 'Regular',
          name: 'ホゲ談義',
          date: new Date('2019-09-30T16:15:00'),
          expired: false,
        });
        done();
      },
    }
  );
});

test('定例会の中止1', done => {
  AbortService(
    { askIdToAbort: async () => 'hoge' },
    {
      find: async id => ({
        kind: 'Regular',
        name: 'ホゲ談義',
        date: new Date('2019-09-30T16:15:00'),
        expired: false,
      }),
      update: async meeting => {
        expect(meeting).toEqual({
          kind: 'Regular',
          name: 'ホゲ談義',
          date: new Date('2019-09-30T16:15:00'),
          expired: true,
        });
        done();
      },
    }
  );
});
