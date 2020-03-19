import Link from 'next/link';
import { FC, ReactElement, useState } from 'react';

import { Meeting } from '../../../lib';
import { DayCell } from './day-cell';
import { ShadowedButton } from '../../components/button';
import DayFinder from './day-finder';

const dayOffset = (date: Date): number => {
  const _date = new Date(date);
  _date.setDate(0);
  return _date.getDay();
};

const DayGrid: FC<{
  day: Date;
  meetings: Meeting[];
  onSelect: (element: HTMLElement, meeting: Meeting) => void;
}> = ({ day, meetings, onSelect }) => {
  const meetingsByDay = meetings.reduce<{ [key: number]: Meeting }>(
    (prev, curr) => ({ ...prev, [curr.date.getDate()]: curr }),
    {}
  );
  const dayCells: ReactElement[] = [];
  let i = new Date(day);
  i.setDate(1);
  for (
    let e = 1;
    i.getMonth() === day.getMonth();
    i.setDate(i.getDate() + 1), ++e
  ) {
    const m = meetingsByDay[e];
    dayCells.push(
      <DayCell
        pos={e + dayOffset(day)}
        day={e}
        key={e}
        meeting={m}
        onClick={ref => onSelect(ref, m)}
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

const MonthNav: FC<{ day: Date; goNext: () => void; goPrev: () => void }> = ({
  day,
  goNext,
  goPrev,
}) => (
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

const Calendar: FC<{
  showing: Date;
  meetings: Meeting[];
  onChange: (newMeeting: Meeting) => void;
  disabled: boolean;
  goNext: () => void;
  goPrev: () => void;
}> = ({ showing, meetings, goNext, goPrev }) => {
  type CalendarSelection = {
    meeting: Meeting;
    element: HTMLElement;
  };
  const [selection, setSelection] = useState<CalendarSelection | null>(null);

  return (
    <>
      <MonthNav day={showing} goPrev={goPrev} goNext={goNext} />
      <p></p>
      <DayGrid
        day={showing}
        meetings={meetings.filter(
          m => m.date.getMonth() === showing.getMonth()
        )}
        onSelect={
          (e, m) =>
            setSelection(old =>
              old?.element == e ? null : { meeting: m, element: e }
            ) // If selected the same element, toggle it
        }
      />
      {selection == null ? (
        <></>
      ) : (
        <DayFinder toStick={selection.element} meeting={selection.meeting} />
      )}
    </>
  );
};

export default Calendar;
