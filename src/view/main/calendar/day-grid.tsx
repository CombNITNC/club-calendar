import { FC, ReactElement } from "react";

import { Meeting, YearMonth } from "../../../lib";
import { DayCell } from "./day-cell";

const offsetThisMonth = (month: number): number => {
  const date = new Date();
  date.setMonth(month - 1);
  date.setDate(0);
  return date.getDay();
};

const daysThisMonth = (month: number): number => {
  let days = 0;
  const date = new Date();
  date.setDate(1);
  date.setMonth(month - 1);
  for (; month - 1 == date.getMonth(); date.setDate(date.getDate() + 1)) {
    ++days;
  }
  return days;
};

export const DayGrid: FC<{
  yearMonth: YearMonth;
  meetings: Meeting[];
  onSelect: (element: HTMLElement, meetings: Meeting[]) => void;
}> = ({ yearMonth, meetings, onSelect }) => {
  const dayCells: ReactElement[] = [];
  const offset = offsetThisMonth(yearMonth.month);
  const days = daysThisMonth(yearMonth.month);
  for (let day = 1; day <= days; ++day) {
    const m: Meeting[] = meetings.filter((m) => m.date.getDate() === day);
    dayCells.push(
      <DayCell
        pos={day + offset}
        day={day}
        key={day}
        hasMeeting={0 < m?.length}
        onSelect={(ref) => onSelect(ref, m)}
      />,
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
