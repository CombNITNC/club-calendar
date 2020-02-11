import { Reducer } from 'react';
import { Meeting, MeetingKind, DateString } from '../lib';

export type State = {
  root: string;
  meetings: Meeting[];
  showing: Date;
  creationModal: 'none' | 'regular' | 'others';
  requesting: boolean;
};

export type Action =
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
  | { type: 'fetch-end'; newMeetings: Meeting[] }
  | { type: 'go-next-month' }
  | { type: 'go-prev-month' }
  | { type: 'modal-regular' }
  | { type: 'modal-others' }
  | { type: 'close-modal' }
  | { type: 'new-regular'; meeting: Meeting }
  | { type: 'new-others'; meeting: Meeting };

const moveMonth = (day: Date, offset: number) => {
  const cloned = new Date(day);
  cloned.setMonth(day.getMonth() + offset);
  return cloned;
};

export const MeetingsReducer: Reducer<State, Action> = (
  state: State,
  action: Action
) => {
  if (action.type === 'fetch-end') {
    return {
      ...state,
      meetings: action.newMeetings,
      requesting: false,
      showing: action.newMeetings[0].date,
    };
  }
  if (['abort', 'update', 'refresh', 'new'].some(v => v === action.type)) {
    return { ...state, requesting: true };
  }
  if (action.type === 'go-next-month') {
    return { ...state, showing: moveMonth(state.showing, 1) };
  }
  if (action.type === 'go-prev-month') {
    return { ...state, showing: moveMonth(state.showing, -1) };
  }
  if (action.type === 'close-modal') {
    return { ...state, creationModal: 'none' };
  }
  if (action.type === 'modal-regular') {
    return { ...state, creationModal: 'regular' };
  }
  if (action.type === 'modal-others') {
    return { ...state, creationModal: 'others' };
  }
  return state;
};

const refresh = async (state: State, dispatch: (action: Action) => void) => {
  const { meetings } = await (await fetch(state.root + 'api/meetings')).json();
  dispatch({
    type: 'fetch-end',
    newMeetings: meetings.map((m: Meeting & { date: string }) => ({
      ...m,
      date: new Date(m.date),
    })),
  });
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
  if (action.type === 'new-regular') {
    const res = await fetch(state.root + 'api/create', {
      method: 'POST',
      body: JSON.stringify({
        kind: 'Regular',
        name: action.meeting.name,
        date: action.meeting.date,
      }),
    });
    if (!res.ok) {
      console.error({ action });
    }
    await refresh(state, dispatch);
    return;
  }
  if (action.type === 'new-others') {
    const res = await fetch(state.root + 'api/create', {
      method: 'POST',
      body: JSON.stringify({
        kind: 'Others',
        name: action.meeting.name,
        date: action.meeting.date,
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
