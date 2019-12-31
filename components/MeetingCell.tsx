import { FC, Fragment, useState } from 'react';
import { Meeting } from '../lib/meeting';

export type MeetingCellProps = {
  meeting: Meeting;
  onChange: (newMeeting: Meeting) => Promise<void>;
};

const MeetingCell: FC<MeetingCellProps> = ({ meeting, onChange }) => {
  const { date, expired } = meeting;
  const [kind, setKind] = useState(meeting.kind);
  const [name, setName] = useState(meeting.name);
  const [updating, setUpdating] = useState(false);

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
      <button
        disabled={updating}
        onClick={async e => {
          setUpdating(true);
          await onChange({ ...meeting, name, kind });
          setUpdating(false);
        }}
      >
        適用
      </button>
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
