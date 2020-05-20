import Link from 'next/link';
import { FC } from 'react';

import { Meeting } from '../../../lib';

const DayFinder: FC<{ toStick: HTMLElement; meetings: Meeting[] }> = ({
  toStick,
  meetings,
}) => (
  <>
    <span>
      {meetings.map((meeting, i) => (
        <Link key={i} href={'./meetings/' + encodeURIComponent(meeting._id)}>
          <a className={meeting.expired ? 'aborted' : ''}>
            {meeting.name}
            {' - '}
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
          </a>
        </Link>
      ))}
    </span>
    <style jsx>{`
      .aborted {
        text-decoration: line-through;
      }
      span {
        position: absolute;
        text-align: center;
        top: ${toStick.offsetTop + toStick.clientHeight}px;
        left: ${toStick.offsetLeft}px;
        width: ${toStick.clientWidth}px;
        background: #fff;
        border: thin solid #555;
        border-radius: 5px;
        box-sizing: border-box;
        box-shadow: 2px 4px 5px darkgray;
        z-index: 2;
      }
      a {
        display: inline-block;
        margin: 0.5em 0;
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

export default DayFinder;
