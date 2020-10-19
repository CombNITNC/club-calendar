import { FC, useRef } from "react";

type DayCellProps = {
  pos: number;
  day: number;
  hasMeeting: boolean;
  onSelect: (ref: HTMLDivElement) => void;
};

export const DayCell: FC<DayCellProps> = ({
  pos,
  day,
  hasMeeting,
  onSelect,
}) => {
  const x = (pos % 7) + 1;
  const color = x === 7 ? "darkblue" : x === 1 ? "darkred" : "black";
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <div
        ref={ref}
        onClick={(e) => {
          if (!hasMeeting || ref.current != e.target) return;
          onSelect(ref.current);
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
          padding-top: 0.5rem;
          width: 100%;
          height: 2em;
          grid-column: ${x};
          grid-row: ${Math.ceil((pos + 1) / 7)};
          color: ${color};
          cursor: pointer;
          ${hasMeeting
            ? `
          background-color: darkcyan;
          color: white;
          `
            : ""}
        }
      `}</style>
    </>
  );
};
