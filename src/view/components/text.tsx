import Head from 'next/head';
import { FC, ReactNode } from 'react';

export const Title: FC<{ children?: ReactNode }> = ({ children }) => (
  <>
    <Head>
      <title>{children}</title>
    </Head>
    <h1>{children}</h1>
    <style jsx>{`
      h1 {
        color: darkblue;
      }
    `}</style>
  </>
);
