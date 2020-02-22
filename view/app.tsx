import { useReducer, FC } from 'react';

import { DateString, Meeting } from '../lib';

import { MeetingsReducer, MeetingsMiddleware } from './main-reducer';
import { Modal } from './modal';

import Calendar from './calendar/calendar';

import { Regular } from './creation/regular';
import { Others } from './creation/others';
import { Menu } from './creation/menu';

const App: FC<{ defaultShowing?: Date }> = ({
  defaultShowing = new Date(),
}) => {
  const [state, dispatchRoot] = useReducer(MeetingsReducer, {
    loading: ['pending'],
    creationModal: 'none',
    showing: new Date(defaultShowing),
  });
  const dispatch = MeetingsMiddleware(state, dispatchRoot);
  const { loading } = state;

  let content = <>読み込み中……</>;
  switch (loading[0]) {
    case 'pending':
      dispatch({ type: 'refresh' });
      break;
    case 'failed':
      content = <>読み込み失敗</>;
      break;
    case 'fetching':
    case 'loaded':
      const requesting = loading[0] === 'fetching';
      const meetings = loading[1] || [];
      content = (
        <>
          {' '}
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
                          meeting: Meeting.regular(v.name, v.date),
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
                          meeting: Meeting.others(v.name, v.date),
                        });
                      }}
                    />
                  </Modal>
                );
            }
          })()}
        </>
      );
  }
  return (
    <>
      <h1>部内カレンダー</h1>
      {content}
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
