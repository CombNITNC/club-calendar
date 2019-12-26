import { NextPage } from 'next';
import { FC, Fragment, useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import { Meeting } from '../lib/meeting';

const Calendar: FC<{ meetings: Meeting[] }> = ({ meetings }) => (
  <Fragment>
    <ul>
      {meetings.map(m => (
        <li key={m._id}>
          {m.name} -- {m.date.toString()}
        </li>
      ))}
    </ul>
  </Fragment>
);

const Index: NextPage<{ initial: Meeting[] }> = ({ initial }) => {
  const [meetings, setMeetings] = useState<Meeting[]>(initial);

  return (
    <Fragment>
      <h1>部内カレンダー</h1>
      <Calendar meetings={meetings} />
      <button
        onClick={async e => {
          const res = await fetch('http://localhost:3000/api/create', {
            method: 'post',
            body: JSON.stringify({
              kind: 'Others',
              name: 'ホゲ談義',
              date: '2019-12-12T12:12:00',
            }),
          });
          getAll().then(setMeetings);
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

const getAll = async (): Promise<Meeting[]> => {
  const { meetings } = await fetch(
    'http://localhost:3000/api/meetings'
  ).then(res => res.json());
  return meetings;
};

Index.getInitialProps = async (): Promise<{ initial: Meeting[] }> => {
  const meetings = await getAll();
  return { initial: meetings };
};

export default Index;
