import { DateString } from '../lib/meeting';
import { useReducer, FC } from 'react';
import { MeetingsReducer, MeetingsMiddleware } from './Reducer';
import Calendar from './calendar/Calendar';
import { Regular } from './creation/Regular';
import { RegularMeeting } from '../lib/entities/regular_meeting';
import { Others } from './creation/Others';
import { OthersMeeting } from '../lib/entities/other_meeting';
import { Menu } from './creation/Menu';
import { Modal } from './Modal';

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
      <Menu
        items={['新しい定例会', '新しいその他の集会']}
        onClick={i => {
          switch (i) {
            case 0:
              dispatch({ type: 'modal-regular' });
              break;
            case 1:
              dispatch({ type: 'modal-others' });
              break;
          }
        }}
      />
      {(() => {
        switch (state.creationModal) {
          case 'regular':
            return (
              <Modal close={() => dispatch({ type: 'close-modal' })}>
                <h3>新しい定例会</h3>
                <Regular
                  onClick={(v: { name: string; date: Date }) => {
                    dispatch({
                      type: 'new-regular',
                      meeting: RegularMeeting.from(v.name, v.date),
                    });
                  }}
                />
              </Modal>
            );
          case 'others':
            return (
              <Modal close={() => dispatch({ type: 'close-modal' })}>
                <h3>新しいその他の集会</h3>
                <Others
                  onClick={(v: { name: string; date: Date }) => {
                    dispatch({
                      type: 'new-others',
                      meeting: OthersMeeting.from(v.name, v.date),
                    });
                  }}
                />
              </Modal>
            );
        }
      })()}
      <style jsx>{`
        h1 {
          color: darkblue;
        }
        h3 {
          margin: 0;
        }
      `}</style>
    </>
  );
};

export default App;
