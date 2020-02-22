import { NextPage } from 'next';
import { EditView } from '../view/edit/edit-view';

const Details: NextPage<{ id?: string }> = ({ id }) => <EditView id={id} />;

Details.getInitialProps = async ({ query }) => {
  if (!('id' in query)) return {};
  const id = typeof query.id === 'string' ? query.id : undefined;
  return { id };
};

export default Details;
