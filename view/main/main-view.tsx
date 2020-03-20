import { useReducer, FC } from 'react';

import { Meeting, YearMonth } from '../../lib';

import { Modal } from '../components/modal';
import { Regular } from '../components/creation/regular';
import { Others } from '../components/creation/others';
import { Menu } from '../components/creation/menu';
import { Title } from '../components/text';

import { Calendar } from './calendar';
import { MeetingsReducer, MeetingsMiddleware, ModalKind } from './main-reducer';

const ModalOverlay: FC<{
  kind: ModalKind;
  close: () => void;
  newRegular: (v: { name: string; date: Date }) => void;
  newOthers: (v: { name: string; date: Date }) => void;
}> = ({ kind, close, newRegular, newOthers }) => {
  switch (kind) {
    case 'regular':
      return (
        <Modal close={close}>
          <Regular title="新しい定例会" onSend={newRegular} />
        </Modal>
      );
    case 'others':
      return (
        <Modal close={close}>
          <Others title="新しいその他の集会" onSend={newOthers} />
        </Modal>
      );
    default:
      return <></>;
  }
};

const App: FC<{ defaultShowing: YearMonth }> = ({ defaultShowing }) => {
  const [state, dispatchRoot] = useReducer(MeetingsReducer, {
    creationModal: 'none',
    showing: defaultShowing,
  });
  const dispatch = MeetingsMiddleware(state, dispatchRoot);

  return (
    <>
      <Title>部内カレンダー</Title>
      <Calendar
        showing={state.showing}
        disabled={false}
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
      <ModalOverlay
        kind={state.creationModal}
        close={() => dispatch({ type: 'close-modal' })}
        newRegular={({ name, date }) => {
          dispatch({
            type: 'new-regular',
            meeting: Meeting.regular(name, date),
          });
        }}
        newOthers={({ name, date }) => {
          dispatch({
            type: 'new-regular',
            meeting: Meeting.others(name, date),
          });
        }}
      />
    </>
  );
};

export default App;
