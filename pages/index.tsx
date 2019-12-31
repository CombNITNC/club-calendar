import { NextPage } from 'next';
import { FC, Fragment, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import { Meeting } from '../lib/meeting';
import MeetingCell from '../components/MeetingCell';

const Calendar: FC<{
  meetings: Meeting[];
  onChange: (newMeeting: Meeting) => Promise<void>;
}> = ({ meetings, onChange }) => (
  <Fragment>
    <ul>
      {meetings.map(m => (
        <li key={m._id}>
          <MeetingCell meeting={m} onChange={onChange} />
        </li>
      ))}
    </ul>
  </Fragment>
);

const Index: NextPage<{ root: string }> = ({ root }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [updating, setUpdating] = useState<boolean>(false);

  return (
    <Fragment>
      <h1>部内カレンダー</h1>
      <Calendar
        meetings={meetings}
        onChange={async newMeeting => {
          const { _id, ...body } = newMeeting;
          setUpdating(true);
          const res = await fetch(root + `api/update/${_id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
          });
          const meetings = await getAll(root);
          setMeetings(meetings);
          setUpdating(false);
        }}
      />
      <button
        disabled={updating}
        onClick={async e => {
          setUpdating(true);
          const meetings = await getAll(root);
          setMeetings(meetings);
          setUpdating(false);
        }}
      >
        取得
      </button>
      <button
        onClick={async e => {
          const res = await fetch(root + 'api/create', {
            method: 'post',
            body: JSON.stringify({
              kind: 'Others',
              name: 'ホゲ談義',
              date: '2019-12-12T12:12:00',
            }),
          });
          const meetings = await getAll(root);
          setMeetings(meetings);
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

const getAll = async (root: string): Promise<Meeting[]> => {
  const { meetings } = await fetch(root + 'api/meetings').then(res =>
    res.json()
  );
  console.log(meetings);
  return meetings;
};

export default Index;
