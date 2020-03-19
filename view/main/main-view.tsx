import { useReducer, FC } from 'react';
import useSWR from 'swr';
import fetch from 'isomorphic-unfetch';

import { Meeting, SerializedMeeting } from '../../lib';

import { Modal } from '../components/modal';
import { Regular } from '../components/creation/regular';
import { Others } from '../components/creation/others';
import { Menu } from '../components/creation/menu';
import { Title } from '../components/text';

import { Calendar } from './calendar';
import { MeetingsReducer, MeetingsMiddleware, ModalKind } from './main-reducer';

const apiRoot = process.env.API_ROOT || 'http://localhost:3080/';

const fetcher = async (url: string): Promise<SerializedMeeting[]> => {
  const res = await fetch(url);
  const { meetings } = await res.json();
  return meetings;
};

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

const App: FC<{ defaultShowing?: Date }> = ({
  defaultShowing = new Date(),
}) => {
  const [state, dispatchRoot] = useReducer(MeetingsReducer, {
    creationModal: 'none',
    showing: new Date(defaultShowing),
  });
  const dispatch = MeetingsMiddleware(state, dispatchRoot);

  const { error, data } = useSWR(apiRoot + 'meetings', fetcher, {
    refreshInterval: 5000,
  });

  if (error != null) {
    console.error({ error });
    return <>読み込み失敗</>;
  }
  if (data == null) return <>読み込み中……</>;

  const meetings = data.map(d => Meeting.deserialize(d));
  return (
    <>
      <Title>部内カレンダー</Title>
      <Calendar
        showing={state.showing}
        meetings={meetings}
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
