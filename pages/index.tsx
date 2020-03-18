import { NextPage, GetServerSideProps } from 'next';
import App from '../view/main/main-view';

type IndexProps = {
  defaultShowing: string;
};

const Index: NextPage<IndexProps> = ({ defaultShowing }) => (
  <App defaultShowing={new Date(defaultShowing)} />
);

export default Index;

export const getServerSideProps: GetServerSideProps<IndexProps> = async ({
  query,
}) => {
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
  return { props: { defaultShowing: defaultShowing.toDateString() } };
};
