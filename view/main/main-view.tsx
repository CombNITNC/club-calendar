import { useReducer, FC } from 'react';

import { DateString, Meeting } from '../../lib';

import { MeetingsReducer, MeetingsMiddleware } from './main-reducer';
import { Modal } from '../components/modal';

import Calendar from './calendar/calendar';

import { Regular } from '../components/creation/regular';
import { Others } from '../components/creation/others';
import { Menu } from '../components/creation/menu';
import { Title } from '../components/text';

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
      <Title>部内カレンダー</Title>
      {content}
    </>
  );
};

export default App;