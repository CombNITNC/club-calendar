import { DateString } from '../lib/meeting';
import { useReducer, FC } from 'react';
import { MeetingsReducer, MeetingsMiddleware } from './Reducer';
import Calendar from './calendar/Calendar';

const App: FC<{ root: string }> = ({ root }) => {
  const [state, dispatchRoot] = useReducer(MeetingsReducer, {
    root,
    meetings: [],
    requesting: false,
    showing: new Date(),
  });
  const dispatch = MeetingsMiddleware(state, dispatchRoot);
  const { meetings, requesting } = state;

  return (
    <>
      <h1>部内カレンダー</h1>
      <Calendar
        showing={state.showing}
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
        goNext={() => dispatch({ type: 'go-next-month' })}
        goPrev={() => dispatch({ type: 'go-prev-month' })}
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
