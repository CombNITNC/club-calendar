import { NextPage, GetServerSideProps } from "next";

import { YearMonthQuery, YearMonth } from "../lib";

import App from "../view/main/main-view";

type IndexProps = {
  defaultShowing: YearMonthQuery;
};

const Index: NextPage<IndexProps> = ({ defaultShowing }) => (
  <App defaultShowing={YearMonth.fromQuery(defaultShowing)} />
);

export default Index;

export const getServerSideProps: GetServerSideProps<IndexProps> = async ({
  query,
}) => {
  const date = new Date();
  const q: YearMonthQuery = { y: date.getFullYear(), m: date.getMonth() + 1 };
  if ("y" in query && typeof query.y === "string") {
    const year = query["y"];
    q.y = parseInt(year, 10);
  }
  if ("m" in query && typeof query.m === "string") {
    const month = query["m"];
    q.m = parseInt(month, 10);
  }
  return { props: { defaultShowing: q } };
};
