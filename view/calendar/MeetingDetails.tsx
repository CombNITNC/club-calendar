import { FC } from 'react';
import { Meeting } from '../../lib/meeting';

const MeetingDetails: FC<{ meeting: Meeting }> = ({ meeting }) => (
  <>
    <div onClick={e => e.preventDefault()}>
      <p>{meeting.name}</p>
      <p>
        {meeting.date
          .getHours()
          ?.toString()
          .padStart(2, '0')}
        :
        {meeting.date
          .getMinutes()
          ?.toString()
          .padStart(2, '0')}
        ~
      </p>
    </div>
    <style jsx>{`
      div {
        position: relative;
        margin: 0;
        text-align: center;
        top: 25%;
        background: #fff;
        border: thin solid #555;
        border-radius: 5px;
        box-sizing: border-box;
        box-shadow: 2px 4px 5px darkgray;
        z-index: 2;
      }
      div:before {
        content: '';
        position: absolute;
        top: -24px;
        left: 50%;
        margin-left: -12px;
        border: 12px solid transparent;
        border-bottom: 12px solid #fff;
        z-index: 5;
      }
      div:after {
        content: '';
        position: absolute;
        top: -28px;
        left: 50%;
        margin-left: -14px;
        border: 14px solid transparent;
        border-bottom: 14px solid #555;
        z-index: 4;
      }
      div {
        animation: fadeIn 0.3s;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `}</style>
  </>
);

export default MeetingDetails;
