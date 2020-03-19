import Link from 'next/link';
import { FC } from 'react';

import { ShadowedButton } from '../../components/button';

export const MonthNav: FC<{
  day: Date;
  goNext: () => void;
  goPrev: () => void;
}> = ({ day, goNext, goPrev }) => (
  <>
    <div className="month-nav">
      <Link
        href={{
          query: {
            y: day.getMonth() == 0 ? day.getFullYear() - 1 : day.getFullYear(),
            m: day.getMonth() == 0 ? 12 : day.getMonth(),
          },
        }}
        replace
      >
        <ShadowedButton onClick={() => goPrev()}>〈</ShadowedButton>
      </Link>
      <div>
        {day.getFullYear()}年{day.getMonth() + 1}月
      </div>
      <Link
        href={{
          query: {
            y: day.getMonth() == 11 ? day.getFullYear() + 1 : day.getFullYear(),
            m: ((day.getMonth() + 1) % 12) + 1,
          },
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
