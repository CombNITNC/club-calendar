import { DateString } from '../lib/meeting';
import { useReducer, FC } from 'react';
import { MeetingsReducer, MeetingsMiddleware } from './Reducer';
import Calendar from './Calendar';

const App: FC<{ root: string }> = ({ root }) => {
  const [state, dispatchRoot] = useReducer(MeetingsReducer, {
    root,
    meetings: [],
    requesting: false,
  });
  const dispatch = MeetingsMiddleware(state, dispatchRoot);
  const { meetings, requesting } = state;

  return (
    <>
      <h1>部内カレンダー</h1>
      <Calendar
        meetings={meetings}
        disabled={requesting}
        onChange={newMeeting => {
          const { _id, date } = newMeeting;
          dispatch({
            type: 'update',
            ...newMeeting,
            id: _id,
            date: new DateString(newMeeting.date),
          });
        }}
      />
      <button
        disabled={requesting}
        onClick={e => {
          dispatch({ type: 'refresh' });
        }}
      >
        取得
      </button>
      <button
        disabled={requesting}
        onClick={async e => {
          dispatch({
            type: 'new',
            ...{
              name: 'ホゲ談義',
              date: new DateString(new Date('2020-02-02')),
              kind: 'Others',
            },
          });
        }}
      >
        集会を作る
      </button>
      <style jsx>{`
        h1 {
          color: darkblue;
        }
      `}</style>
    </>
  );
};

export default App;
