import { NextPage } from 'next';
import { FC, Fragment } from 'react';

const Calendar: FC = () => <Fragment></Fragment>;

const Index: NextPage = () => (
  <Fragment>
    <h1>部内カレンダー</h1>
    <Calendar />
    <button>集会を作る</button>
    <style jsx>{`
      h1 {
        color: darkblue;
      }
    `}</style>
  </Fragment>
);

export default Index;
