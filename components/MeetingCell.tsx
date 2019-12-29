import { FC, Fragment, useState } from 'react';
import { Meeting } from '../lib/meeting';

export type MeetingCellProps = {
  meeting: Meeting;
  onChange: (newMeeting: Meeting) => void;
};

const MeetingCell: FC<MeetingCellProps> = ({ meeting, onChange }) => {
  const { date, expired } = meeting;
  const [kind, setKind] = useState(meeting.kind);
  const [name, setName] = useState(meeting.name);

  return (
    <Fragment>
      <select
        onChange={e =>
          setKind(e.target.value === 'Regular' ? 'Regular' : 'Others')
        }
      >
        <option value="Regular">定例会</option>
        <option value="Others">その他の集会</option>
      </select>
      <input
        type="textarea"
        defaultValue={name}
        onChange={e => setName(e.target.value)}
      ></input>
      <div>{date.toString()}</div>
      <button onClick={e => onChange({ ...meeting, name, kind })}>適用</button>
      <style jsx>{`
        .regular {
          color: darkred;
        }
        .others {
          color: darkgreen;
        }
      `}</style>
    </Fragment>
  );
};

export default MeetingCell;
