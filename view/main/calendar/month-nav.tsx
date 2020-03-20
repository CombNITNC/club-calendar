import Link from 'next/link';
import { FC } from 'react';

import { YearMonth } from '../../../lib';

import { ShadowedButton } from '../../components/button';

export const MonthNav: FC<{
  yearMonth: YearMonth;
  goNext: () => void;
  goPrev: () => void;
}> = ({ yearMonth, goNext, goPrev }) => (
  <>
    <div className="month-nav">
      <Link
        href={{
          query: yearMonth.prev().toQuery(),
        }}
        replace
      >
        <ShadowedButton onClick={() => goPrev()}>〈</ShadowedButton>
      </Link>
      <div>
        {yearMonth.year}年{yearMonth.month}月
      </div>
      <Link
        href={{
          query: yearMonth.next().toQuery(),
        }}
        replace
      >
        <ShadowedButton onClick={() => goNext()}>〉</ShadowedButton>
      </Link>
    </div>
    <style jsx>{`
      div {
        display: flex;
        justify-content: space-around;
      }
    `}</style>
  </>
);
