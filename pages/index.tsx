import { NextPage } from 'next';
import App from '../view/app';

const Index: NextPage<{ defaultShowing?: Date }> = ({ defaultShowing }) => (
  <App defaultShowing={defaultShowing} />
);

Index.getInitialProps = async ({ query }) => {
  const defaultShowing = new Date();
  if ('y' in query) {
    const year = query['y'];
    defaultShowing.setFullYear(
      parseInt(typeof year === 'string' ? year : year[0], 10)
    );
  }
  if ('m' in query) {
    const month = query['m'];
    defaultShowing.setMonth(
      parseInt(typeof month === 'string' ? month : month[0], 10) - 1
    );
  }
  return { defaultShowing };
};

export default Index;
