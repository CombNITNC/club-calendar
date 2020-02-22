import { Meeting } from '../../lib';
import { Reducer } from 'react';
import fetch from 'isomorphic-unfetch';

export type State = {
  showingId: string;
  loading: ['pending'] | ['fetching'] | ['failed'] | ['loaded', Meeting];
};

export type Action =
  | { type: 'load-start' }
  | { type: 'load-failed' }
  | { type: 'load-end'; meeting: Meeting };

export const DetailsReducer: Reducer<State, Action> = (state, action) => {
  if (action.type === 'load-start') {
    return { ...state, loading: ['fetching'] };
  }
  if (action.type === 'load-failed') {
    return { ...state, loading: ['failed'] };
  }
  if (action.type === 'load-end') {
    return { ...state, loading: ['loaded', action.meeting] };
  }
  return state;
};

const apiRoot = process.env.API_ROOT || 'http://localhost:3080/';

export const DetailsMiddleware = (
  state: State,
  dispatch: (action: Action) => void
) => async (action: Action) => {
  dispatch(action);
  if (action.type === 'load-start') {
    const res = await fetch(
      apiRoot + 'meetings?id=' + encodeURIComponent(state.showingId)
    );
    if (!res.ok) {
      dispatch({ type: 'load-failed' });
      return;
    }
    const { meetings } = await res.json();
    if (!(typeof meetings === 'object' && 0 in meetings)) {
      dispatch({ type: 'load-failed' });
      return;
    }
    const m = meetings[0];
    dispatch({ type: 'load-end', meeting: { ...m, date: new Date(m.date) } });
  }
};
