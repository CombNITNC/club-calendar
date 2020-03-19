import { FC, useState } from 'react';

import { Meeting } from '../../../lib';
import DayFinder from './day-finder';
import { DayGrid } from './day-grid';
import { MonthNav } from './month-nav';

type CalendarProps = {
  showing: Date;
  meetings: Meeting[];
  disabled: boolean;
  goNext: () => void;
  goPrev: () => void;
};

export const Calendar: FC<CalendarProps> = ({
  showing,
  meetings,
  goNext,
  goPrev,
}) => {
  type CalendarSelection = {
    meetings: Meeting[];
    element: HTMLElement;
  };
  const [selection, setSelection] = useState<CalendarSelection | null>(null);

  return (
    <>
      <MonthNav
        day={showing}
        goPrev={() => {
          setSelection(null);
          goPrev();
        }}
        goNext={() => {
          setSelection(null);
          goNext();
        }}
      />
      <p></p>
      <DayGrid
        day={showing}
        meetings={meetings.filter(
          m => m.date.getMonth() === showing.getMonth()
        )}
        onSelect={
          (e, m) =>
            setSelection(old =>
              old?.element == e ? null : { meetings: m, element: e }
            ) // If selected the same element, toggle it
        }
      />
      {selection == null ? (
        <></>
      ) : (
        <DayFinder toStick={selection.element} meetings={selection.meetings} />
      )}
    </>
  );
};
