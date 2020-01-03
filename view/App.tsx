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
            date: new DateString(date),
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
      <style jsx>{`
        h1 {
          color: darkblue;
        }
      `}</style>
    </>
  );
};

export default App;
