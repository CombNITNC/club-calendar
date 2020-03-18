import { NextPage, GetServerSideProps } from 'next';
import fetch from 'isomorphic-unfetch';

import { DetailsView } from '../../view/details/details-view';
import { SerializedMeeting, Meeting } from '../../lib';

type DetailsProps = { meeting?: SerializedMeeting };

const Details: NextPage<DetailsProps> = ({ meeting }) => (
  <DetailsView meeting={meeting && Meeting.deserialize(meeting)} />
);

export default Details;

const apiRoot = process.env.API_ROOT || 'http://localhost:3080/';

export const getServerSideProps: GetServerSideProps<DetailsProps> = async ({
  params,
  res,
}) => {
  if (params == null) {
    res.end('Not found');
    return { props: { meeting: undefined } };
  }

  const id = params.id || null;
  if (typeof id !== 'string') {
    res.end('Not found');
    return { props: { meeting: undefined } };
  }

  const fetched = await fetch(
    `${apiRoot}meetings?id=${encodeURIComponent(id)}`
  );
  const { meetings }: { meetings: SerializedMeeting[] } = await fetched.json();
  if (!(0 in meetings)) {
    res.end('Not found');
    return { props: { meeting: undefined } };
  }
  const meeting = meetings[0];
  return { props: { meeting } };
};
