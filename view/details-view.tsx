import Link from 'next/link';
import { FC } from 'react';
import { Meeting, DateString } from '../lib';
import { Form } from './creation/form';

const detailsForm = (meeting: Meeting) => {
  const schema = {
    名前: {
      type: 'string' as const,
      value: meeting.name,
    },
    日時: {
      type: 'date' as const,
      value: new DateString(meeting.date).toDatetimeLocal(),
    },
  };
  return Form(
    schema,
    (v: any) => {
      const errors: string[] = [];
      if (v['名前'].value === '') {
        errors.push('名前を入力してください');
      }
      if (v['日時'].value === '' || !DateString.ableTo(v['日時'].value)) {
        errors.push('正常な日時を入力してください');
      }
      return errors;
    },
    v => ({
      ...meeting,
      name: v['名前'].value,
      date: new Date(v['日時'].value),
    })
  );
};

const apiRoot = process.env.API_ROOT || 'http://localhost:3080/';

export const DetailsView: FC<{ meeting?: Meeting }> = ({ meeting }) => {
  let content = <div>集会情報の取得に失敗しました</div>;
  if (meeting != null) {
    const DetailsForm = detailsForm(meeting);
    content = (
      <DetailsForm
        onClick={m => {
          fetch(apiRoot + 'meetings/' + encodeURIComponent(m._id), {
            method: 'PATCH',
            body: JSON.stringify(m),
          });
        }}
      />
    );
  }

  return (
    <>
      <Link href={'../'}>
        <div>戻る</div>
      </Link>
      <h1>集会情報の編集</h1>
      {content}
      <style jsx>{`
        h1 {
          color: darkblue;
        }
        h3 {
          margin: 0;
        }
        div {
          width: 10em;
          box-shadow: 1px 1px 5px gray;
          text-align: center;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};
