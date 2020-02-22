import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';

import { DetailsView } from '../view/details-view';
import { Meeting, DateString } from '../lib';

const Details: NextPage<{ meeting?: Meeting }> = ({ meeting }) => (
  <DetailsView meeting={meeting} />
);

const apiRoot = process.env.API_ROOT || 'http://localhost:3080/';

Details.getInitialProps = async ({ query }) => {
  if (!('id' in query)) return {};

  const id = typeof query.id === 'string' ? query.id : undefined;
  if (id == null) return {};

  const res = await fetch(apiRoot + 'meetings?id=' + encodeURIComponent(id));
  const { meetings } = await res.json();
  if (!(0 in meetings && DateString.ableTo(meetings[0].date))) {
    return {};
  }
  const m = meetings[0];
  const meeting = { ...m, date: new Date(m.date) };
  return { meeting };
};

export default Details;
