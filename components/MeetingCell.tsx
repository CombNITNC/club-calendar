import { FC, Fragment, useState } from 'react';
import { Meeting } from '../lib/meeting';

export type MeetingCellProps = {
  meeting: Meeting;
  onChange: (newMeeting: Meeting) => void;
};

const MeetingCell: FC<MeetingCellProps> = ({ meeting, onChange }) => {
  const { kind, date, expired } = meeting;
  const [name, setName] = useState<string>(meeting.name);

  return (
    <Fragment>
      {kind === 'Regular' ? (
        <div className="regular">定例会</div>
      ) : (
        <div className="others">その他の集会</div>
      )}
      <input
        type="textarea"
        defaultValue={name}
        onChange={e => setName(e.target.value)}
      ></input>
      <div>{date.toString()}</div>
      <button onClick={e => onChange({ ...meeting, name })}>適用</button>
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
