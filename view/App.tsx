import { DateString } from '../lib/meeting';
import { useReducer, FC } from 'react';
import { MeetingsReducer, MeetingsMiddleware } from './Reducer';
import Calendar from './calendar/Calendar';
import { Regular } from './creation/Regular';
import { RegularMeeting } from '../lib/entities/regular_meeting';
import { Others } from './creation/Others';
import { OthersMeeting } from '../lib/entities/other_meeting';

const App: FC<{ root: string }> = ({ root }) => {
  const [state, dispatchRoot] = useReducer(MeetingsReducer, {
    root,
    meetings: [],
    requesting: false,
    creationModal: 'none',
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
      <span>
        <select
          onChange={e => {
            if (e.target.value === '0') {
              dispatch({ type: 'close-modal' });
            }
            if (e.target.value === '1') {
              dispatch({ type: 'modal-regular' });
            }
            if (e.target.value === '2') {
              dispatch({ type: 'modal-others' });
            }
          }}
        >
          <option value="0"> - 集会追加メニュー - </option>
          <option value="1">新しい定例会</option>
          <option value="2">新しいその他の集会</option>
        </select>
        {(() => {
          switch (state.creationModal) {
            case 'regular':
              return (
                <Regular
                  onClick={v => {
                    dispatch({
                      type: 'new-regular',
                      meeting: RegularMeeting.from(v.name, v.date),
                    });
                  }}
                />
              );
            case 'others':
              return (
                <Others
                  onClick={v => {
                    dispatch({
                      type: 'new-others',
                      meeting: OthersMeeting.from(v.name, v.date),
                    });
                  }}
                />
              );
            case 'none':
              return <></>;
          }
        })()}
      </span>
      <style jsx>{`
        h1 {
          color: darkblue;
        }
      `}</style>
    </>
  );
};

export default App;
