import { FC, useRef } from 'react';
import { Meeting } from '../../../lib';

type DayCellProps = {
  pos: number;
  day: number;
  meeting?: Meeting;
  onClick: (ref: HTMLDivElement) => void;
};

export const DayCell: FC<DayCellProps> = ({ pos, day, meeting, onClick }) => {
  const x = (pos % 7) + 1;
  const color = x === 7 ? 'darkblue' : x === 1 ? 'darkred' : 'black';
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <div
        ref={ref}
        onClick={e => {
          if (meeting == null || ref.current != e.target) return;
          onClick(ref.current);
        }}
      >
        {day}
      </div>
      <style jsx>{`
        div {
          display: inline-grid;
          text-align: center;
          box-shadow: 1px 1px 2px darkgray;
          margin: 0;
          width: 100%;
          height: 2em;
          grid-column: ${x};
          grid-row: ${Math.ceil((pos + 1) / 7)};
          color: ${color};
          cursor: pointer;
          ${meeting == null
            ? ''
            : `
          background-color: darkcyan;
          color: white;
          `}
        }
      `}</style>
    </>
  );
};
