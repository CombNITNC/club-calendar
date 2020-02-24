import { FC, ReactElement } from 'react';
import { Meeting } from '../../../lib';
import { DayCell } from './day-cell';
import { ShadowedButton } from '../../components/button';

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
      <div>
        <ShadowedButton onClick={() => goPrev()}>〈</ShadowedButton>
      </div>
      <div>
        {day.getFullYear()}年{day.getMonth() + 1}月
      </div>
      <div>
        <ShadowedButton onClick={() => goNext()}>〉</ShadowedButton>
      </div>
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
}> = ({ showing, meetings, goNext, goPrev }) => (
  <>
    <MonthNav day={showing} goPrev={goPrev} goNext={goNext} />
    <p></p>
    <DayGrid
      day={showing}
      meetings={meetings.filter(m => m.date.getMonth() === showing.getMonth())}
    />
  </>
);

export default Calendar;
