import { NextPage, GetServerSideProps } from "next";

import { DetailsView } from "../../view/details/details-view";

type DetailsProps = { id: string };

const Details: NextPage<DetailsProps> = ({ id }) => <DetailsView id={id} />;

export default Details;

export const getServerSideProps: GetServerSideProps<DetailsProps> = async ({
  params,
  res,
}) => {
  const id = params?.id;
  if (typeof id !== "string") {
    res.end("Not found");
    throw new Error("Not found");
  }
  return { props: { id } };
};
