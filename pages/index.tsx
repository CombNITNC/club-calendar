import { NextPage } from 'next';
import { FC, Fragment, useState, useReducer } from 'react';
import { Meeting, DateString } from '../lib/meeting';
import { MeetingsReducer, MeetingsMiddleware } from '../components/Reducer';

export type MeetingCellProps = {
  meeting: Meeting;
  onChange: (newMeeting: Meeting) => void;
  disabled: boolean;
};

const MeetingCell: FC<MeetingCellProps> = ({ disabled, meeting, onChange }) => {
  const { date, name, kind, expired } = meeting;
  const [m, setM] = useState(meeting);

  return (
    <Fragment>
      <select
        defaultValue={kind}
        onChange={e =>
          setM({
            ...m,
            kind: e.target.value === 'Regular' ? 'Regular' : 'Others',
          })
        }
      >
        <option value="Regular">定例会</option>
        <option value="Others">その他の集会</option>
      </select>
      <input
        type="textarea"
        defaultValue={name}
        onChange={e => setM({ ...m, name: e.target.value })}
      ></input>
      <div>{date.toString()}</div>
      <button disabled={disabled} onClick={async e => onChange(m)}>
        適用
      </button>
      <style jsx>{`
        .regular {
          color: darkred;
        }
        .others {
          color: darkgreen;
        }
      `}</style>
    </Fragment>
  );
};

const Calendar: FC<{
  meetings: Meeting[];
  onChange: (newMeeting: Meeting) => void;
  disabled: boolean;
}> = ({ meetings, onChange, disabled }) => (
  <Fragment>
    <ul>
      {meetings.map(m => (
        <li key={m._id}>
          <MeetingCell disabled={disabled} meeting={m} onChange={onChange} />
        </li>
      ))}
    </ul>
  </Fragment>
);

const Index: NextPage<{ root: string }> = ({ root }) => {
  const [state, dispatchRoot] = useReducer(MeetingsReducer, {
    root,
    meetings: [],
    requesting: false,
  });
  const dispatch = MeetingsMiddleware(state, dispatchRoot);
  const { meetings, requesting } = state;

  return (
    <Fragment>
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
    </Fragment>
  );
};

Index.getInitialProps = async ({ req }) => {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  const rootUrl = () => {
    if ('browser' in process) return `${protocol}://${window.location.host}/`;

    if (req != null) return `${protocol}://${req.headers.host}/`;
    return '/';
  };
  return { root: rootUrl() };
};

export default Index;
