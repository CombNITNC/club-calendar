import { FC, useState } from 'react';
import { Meeting } from '../lib/meeting';
import MeetingDetails from './MeetingDetails';

type DayCellProps = {
  pos: number;
  day: number;
  meeting?: Meeting;
};

const DayCell: FC<DayCellProps> = ({ pos, day, meeting }) => {
  const x = (pos % 7) + 1;
  const color =
    meeting != null
      ? 'darkgreen'
      : x === 7
      ? 'darkblue'
      : x === 1
      ? 'darkred'
      : 'black';
  const [showingDetails, setShowingDetails] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setShowingDetails(!showingDetails);
        }}
      >
        {day}
        <MeetingDetails visibility={showingDetails} meeting={meeting} />
      </div>
      <style jsx>{`
        div {
          display: inline-grid;
          text-align: center;
          outline: thin solid darkgray;
          margin: 0;
          height: 2em;
          grid-column: ${x};
          grid-row: ${Math.ceil((pos + 1) / 7)};
          color: ${color};
        }
      `}</style>
    </>
  );
};

const range = (size: number, startAt = 0): number[] => {
  return [...Array(size).keys()].map((_, i) => i + startAt);
};

const dayOffset = (date: Date): number => {
  const _date = new Date(date);
  _date.setDate(0);
  return _date.getDay();
};

const Calendar: FC<{
  meetings: Meeting[];
  onChange: (newMeeting: Meeting) => void;
  disabled: boolean;
}> = ({ meetings, onChange, disabled }) => {
  const day = 0 in meetings ? meetings[0].date : new Date();
  const meetingsByDay = meetings.reduce<{ [key: number]: Meeting }>(
    (prev, curr) => ({ ...prev, [curr.date.getDate()]: curr }),
    {}
  );
  return (
    <>
      <div className="day-grid">
        {range(31, 1).map((e: number) => (
          <DayCell
            pos={e + dayOffset(day)}
            day={e}
            key={e}
            meeting={meetingsByDay[e]}
          />
        ))}
      </div>
      <style jsx>{`
        .day-grid {
          display: grid;
          grid-auto-rows: auto;
          grid-template-columns: repeat(auto-fill, 4em);
        }
      `}</style>
    </>
  );
};

export default Calendar;
