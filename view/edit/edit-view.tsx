import Link from 'next/link';
import { FC, useReducer } from 'react';
import { DetailsReducer, DetailsMiddleware } from './details-reducer';

export const EditView: FC<{ id?: string }> = ({ id }) => {
  const [state, dispatchRoot] = useReducer(DetailsReducer, {
    showingId: id || '',
    loading: ['pending'],
  });
  const dispatch = DetailsMiddleware(state, dispatchRoot);
  let content = <>Loading...</>;
  switch (state.loading[0]) {
    case 'pending':
      dispatch({ type: 'load-start' });
    case 'failed':
      content = <>集会データの読み込みに失敗しました</>;
      break;
    case 'loaded':
      const m = state.loading[1];
      content = (
        <>
          <label>集会の名前:</label>
          <input defaultValue={m.name} />
          <label>日時:</label>
          <input type="date" defaultValue={m.date.toISOString().slice(0, 10)} />
          <button>適用</button>
        </>
      );
  }
  return (
    <>
      <Link href={'../'}>
        <a>Back</a>
      </Link>
      <div>{content}</div>
    </>
  );
};
