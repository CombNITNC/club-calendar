import { FC, ReactElement } from 'react';

import { Meeting } from '../../../lib';
import { DayCell } from './day-cell';

const dayOffset = (date: Date): number => {
  const _date = new Date(date);
  _date.setDate(0);
  return _date.getDay();
};

export const DayGrid: FC<{
  day: Date;
  meetings: Meeting[];
  onSelect: (element: HTMLElement, meetings: Meeting[]) => void;
}> = ({ day, meetings, onSelect }) => {
  const dayCells: ReactElement[] = [];
  let i = new Date(day);
  i.setDate(1);
  for (
    let e = 1;
    i.getMonth() === day.getMonth();
    i.setDate(i.getDate() + 1), ++e
  ) {
    const m: Meeting[] = meetings.filter(m => m.date.getDate() === e);
    dayCells.push(
      <DayCell
        pos={e + dayOffset(day)}
        day={e}
        key={e}
        hasMeeting={0 < m?.length}
        onSelect={ref => onSelect(ref, m)}
      />
    );
  }
  return (
    <>
      <div>{dayCells}</div>
      <style jsx>{`
        div {
          display: grid;
          grid-auto-rows: auto;
          grid-template-columns: repeat(auto-fill, 14.2%);
        }
      `}</style>
    </>
  );
};
