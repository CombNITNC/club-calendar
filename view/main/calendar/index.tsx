import { FC, useState } from 'react';
import useSWR from 'swr';

import { Meeting, YearMonth, SerializedMeeting } from '../../../lib';

import DayFinder from './day-finder';
import { DayGrid } from './day-grid';
import { MonthNav } from './month-nav';

const apiRoot = process.env.API_ROOT || 'http://localhost:3080/';

const fetcher = async (url: string): Promise<SerializedMeeting[]> => {
  const res = await fetch(url);
  const { meetings } = await res.json();
  return meetings;
};

type CalendarProps = {
  showing: YearMonth;
  disabled: boolean;
  goNext: () => void;
  goPrev: () => void;
};

export const Calendar: FC<CalendarProps> = ({ showing, goNext, goPrev }) => {
  type CalendarSelection = {
    meetings: Meeting[];
    element: HTMLElement;
  };
  const [selection, setSelection] = useState<CalendarSelection | null>(null);

  const { error, data } = useSWR(
    `${apiRoot}meetings?from=${showing.toString()}&to=${showing
      .next()
      .toString()}`,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  if (error != null) {
    console.error({ error });
    return <>読み込み失敗</>;
  }
  if (data == null) return <>読み込み中……</>;

  const meetings = data.map(d => Meeting.deserialize(d));

  return (
    <>
      <MonthNav
        yearMonth={showing}
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
        yearMonth={showing}
        meetings={meetings}
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
