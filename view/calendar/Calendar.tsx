import { FC, useState, ReactElement } from 'react';
import { Meeting } from '../../lib/meeting';
import { DayCell } from './DayCell';

const range = (size: number, startAt = 0): number[] => {
  return [...Array(size).keys()].map((_, i) => i + startAt);
};

const dayOffset = (date: Date): number => {
  const _date = new Date(date);
  _date.setDate(0);
  return _date.getDay();
};

const DayGrid: FC<{ day: Date; meetings: Meeting[] }> = ({ day, meetings }) => {
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
    dayCells.push(
      <DayCell
        pos={e + dayOffset(day)}
        day={e}
        key={e}
        meeting={meetingsByDay[e]}
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
          grid-template-columns: repeat(auto-fill, 4em);
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
      <span className="button" onClick={() => goPrev()}>
        〈
      </span>
      <span>
        {day.getFullYear()}年{day.getMonth() + 1}月
      </span>
      <span className="button" onClick={() => goNext()}>
        〉
      </span>
    </div>
    <style jsx>{`
      div {
        display: flex;
        width: 28em;
      }
      span {
        flex: auto;
        text-align: center;
      }
      .button {
        box-shadow: 1px 1px 5px gray;
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
}> = ({ showing, meetings, goNext, goPrev }) => (
  <>
    <MonthNav day={showing} goPrev={goPrev} goNext={goNext} />
    <hr />
    <DayGrid
      day={showing}
      meetings={meetings.filter(m => m.date.getMonth() === showing.getMonth())}
    />
  </>
);

export default Calendar;
