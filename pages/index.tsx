import { NextPage } from 'next';
import { FC, Fragment } from 'react';
import fetch from 'isomorphic-unfetch';
import { Meeting } from '../lib/meeting';

const Calendar: FC<{ meetings: Meeting[] }> = ({ meetings }) => (
  <Fragment>
    <ul>
      {meetings.map(m => (
        <li key={m.date.toString()}>{m.name}</li>
      ))}
    </ul>
  </Fragment>
);

const Index: NextPage<{ meetings: Meeting[] }> = ({ meetings }) => (
  <Fragment>
    <h1>部内カレンダー</h1>
    <Calendar meetings={meetings} />
    <button>集会を作る</button>
    <style jsx>{`
      h1 {
        color: darkblue;
      }
    `}</style>
  </Fragment>
);

Index.getInitialProps = async (): Promise<{ meetings: Meeting[] }> => {
  const [regulars, others] = await Promise.all(
    [
      'http://localhost:3000/api/fetch?kind=Regular&from=2020-01-01&to=2020-12-31',
      'http://localhost:3000/api/fetch?kind=Others&from=2020-01-01&to=2020-12-31',
    ].map(url =>
      fetch(url)
        .then(res => res.json())
        .then(json => json.meetings)
    )
  );
  return { meetings: [...regulars, ...others] };
};

export default Index;
