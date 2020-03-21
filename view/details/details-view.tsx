import Link from 'next/link';
import { FC, useState } from 'react';
import useSWR from 'swr';

import { Meeting, SerializedMeeting } from '../../lib';
import { ShadowedButton, ShadowedRedButton } from '../components/button';
import { detailsForm } from './details-form';
import { AbortDialog } from './abort-dialog';

const apiRoot = process.env.API_ROOT || 'http://localhost:3080/';

const DetailsContent: FC<{ id: string }> = ({ id }) => {
  const [showingAbortDialog, setShowingAbortDialog] = useState(false);
  const { data } = useSWR<{ meetings: SerializedMeeting[] }>(
    `${apiRoot}meetings`,
    url => fetch(url).then(res => res.json())
  );
  if (data == null) return <div>読み込み中……</div>;

  const found = data.meetings.find(m => m.id === id);
  if (found == null) return <div>集会情報の取得に失敗しました</div>;

  const meeting = Meeting.deserialize(found);
  const DetailsForm = detailsForm(meeting);
  return (
    <>
      <DetailsForm
        title="集会情報の編集"
        onSend={m => {
          fetch(`${apiRoot}meetings/${encodeURIComponent(id)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(m),
          });
        }}
        sendLabel="更新"
      />
      <ShadowedRedButton onClick={() => setShowingAbortDialog(true)}>
        中止
      </ShadowedRedButton>
      {!showingAbortDialog ? (
        <></>
      ) : (
        <AbortDialog
          onConfirm={() => {
            fetch(`${apiRoot}meetings/${encodeURIComponent(id)}/expire`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
            });
          }}
          onCancel={() => setShowingAbortDialog(false)}
        />
      )}
    </>
  );
};

export const DetailsView: FC<{ id: string }> = ({ id }) => {
  return (
    <>
      <Link href={'../../'}>
        <ShadowedButton>戻る</ShadowedButton>
      </Link>
      <DetailsContent id={id} />
    </>
  );
};
