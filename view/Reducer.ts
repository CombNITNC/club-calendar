import { Reducer } from 'react';
import { Meeting, MeetingKind, DateString } from '../lib/meeting';

export type State = {
  root: string;
  meetings: Meeting[];
  requesting: boolean;
};

export type Action =
  | {
      type: 'new';
      name: string;
      kind: MeetingKind;
      date: DateString;
    }
  | {
      type: 'refresh';
    }
  | {
      type: 'update';
      id: string;
      name: string;
      kind: MeetingKind;
      date: DateString;
    }
  | {
      type: 'abort';
      id: string;
    }
  | { type: 'fetch-end'; newMeetings: Meeting[] };

export const MeetingsReducer: Reducer<State, Action> = (
  state: State,
  action: Action
) => {
  if (action.type === 'fetch-end') {
    return { ...state, meetings: action.newMeetings, requesting: false };
  }
  if (['abort', 'update', 'refresh', 'new'].some(v => v === action.type)) {
    return { ...state, requesting: true };
  }
  return state;
};

const refresh = async (state: State, dispatch: (action: Action) => void) => {
  const { meetings } = await (await fetch(state.root + 'api/meetings')).json();
  dispatch({ type: 'fetch-end', newMeetings: meetings });
};

export const MeetingsMiddleware = (
  state: State,
  dispatch: (action: Action) => void
) => async (action: Action) => {
  dispatch(action);
  if (action.type === 'refresh') {
    await refresh(state, dispatch);
    return;
  }
  if (action.type === 'new') {
    const res = await fetch(state.root + 'api/create', {
      method: 'POST',
      body: JSON.stringify({
        kind: action.kind,
        name: action.name,
        date: action.date,
      }),
    });
    if (!res.ok) {
      console.error({ action });
    }
    await refresh(state, dispatch);
    return;
  }
  if (action.type === 'update') {
    const res = await fetch(state.root + `api/update/${action.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        kind: action.kind,
        name: action.name,
        date: action.date,
      }),
    });
    if (!res.ok) {
      console.error({ action });
    }
    await refresh(state, dispatch);
    return;
  }
  if (action.type === 'abort') {
    const res = await fetch(state.root + `api/abort/${action.id}`, {
      method: 'PUT',
    });
    if (!res.ok) {
      console.error({ action });
    }
    await refresh(state, dispatch);
    return;
  }
};
