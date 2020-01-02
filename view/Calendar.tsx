import { FC } from 'react';
import { Meeting } from '../lib/meeting';

const range = (size: number, startAt = 0): number[] => {
  return [...Array(size).keys()].map((_, i) => i + startAt);
};

const DayCell: FC<{ pos: number; day: number }> = ({ pos, day }) => {
  const x = (pos % 7) + 1;
  const color = x === 1 ? 'darkred' : x === 7 ? 'darkblue' : 'black';
  return (
    <>
      <p>{day}</p>
      <style jsx>{`
        p {
          text-align: center;
          outline: thin solid darkgray;
          margin: 0;
          grid-column: ${x};
          grid-row: ${Math.ceil((pos + 1) / 7)};
          color: ${color};
        }
      `}</style>
    </>
  );
};

const dayOffset = (date: Date): number => {
  date.setDate(0);
  return date.getDay();
};

const Calendar: FC<{
  meetings: Meeting[];
  onChange: (newMeeting: Meeting) => void;
  disabled: boolean;
}> = ({ meetings, onChange, disabled }) => (
  <>
    <div className="day-grid">
      {range(31, 1).map((e: number) => (
        <DayCell pos={e + dayOffset(new Date())} day={e} key={e} />
      ))}
    </div>
    <style jsx>{`
      .day-grid {
        display: grid;
        grid-auto-rows: auto;
        grid-template-columns: repeat(auto-fill, 14%);
      }
    `}</style>
  </>
);

export default Calendar;
