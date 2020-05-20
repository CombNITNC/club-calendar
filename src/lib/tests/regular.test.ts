import {
  FetchService,
  CreateService,
  UpdateService,
  AbortService,
  Duration,
  Meeting,
} from '..';
import { transform } from '../abst/meeting-query';
import { BoolQuery } from '../skin/bool-query';

const regularName = '定例会';
test('定例会の取得', done => {
  FetchService(
    {
      askQuery: async () => [
        'and',
        ['holdAfter', new Date('2019-04-10')],
        ['holdBefore', new Date('2019-04-20')],
      ],
      show: async meetings => {
        expect(meetings).toEqual([
          Meeting.regular(regularName, new Date('2019-04-10')),
          Meeting.regular(regularName, new Date('2019-04-15')),
          Meeting.regular(regularName, new Date('2019-04-20')),
        ]);
        done();
      },
    },
    {
      get: async query =>
        [
          Meeting.regular(regularName, new Date('2019-04-08')),
          Meeting.regular(regularName, new Date('2019-04-10')),
          Meeting.regular(regularName, new Date('2019-04-15')),
          Meeting.regular(regularName, new Date('2019-04-22')),
          Meeting.regular(regularName, new Date('2019-04-20')),
          Meeting.regular(regularName, new Date('2019-04-29')),
        ].filter(e => transform(query, BoolQuery)(e)),
    }
  );
});

test('定例会の登録1', done => {
  CreateService(
    {
      askMeeting: async () =>
        Meeting.regular(regularName, new Date('2019-04-08')),
      askDuration: async () =>
        new Duration(new Date('2019-04-04'), new Date('2019-04-31')),
      reportCreatedIds: async id => {},
    },
    {
      save: async (...meetings): Promise<string[]> => {
        expect(meetings).toEqual([
          Meeting.regular(regularName, new Date('2019-04-08')),
          Meeting.regular(regularName, new Date('2019-04-15')),
          Meeting.regular(regularName, new Date('2019-04-22')),
          Meeting.regular(regularName, new Date('2019-04-29')),
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
        Meeting.regular(regularName, new Date('2019-09-16')),
      askDuration: async () =>
        new Duration(new Date('2019-09-24'), new Date('2019-09-30')),
      reportCreatedIds: async ids => {},
    },
    {
      save: async (...meetings): Promise<string[]> => {
        expect(meetings).toEqual([
          Meeting.regular(regularName, new Date('2019-09-30')),
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
        _id: '0',
        kind: 'Regular',
        name: 'ホゲホゲ談義',
        date: new Date('2019-09-30T16:15:00'),
        expired: false,
      }),
      update: async meeting => {
        expect(meeting).toEqual({
          _id: '0',
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
        _id: '0',
        kind: 'Regular',
        name: 'ホゲ談義',
        date: new Date('2019-09-30T16:15:00'),
        expired: false,
      }),
      update: async meeting => {
        expect(meeting).toEqual({
          _id: '0',
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
