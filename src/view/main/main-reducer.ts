import { Reducer } from "react";

import { Meeting, YearMonth, Duration } from "../../lib";

export type ModalKind = "none" | "regular" | "others";

export type State = {
  showing: YearMonth;
  creationModal: ModalKind;
};

export type Action =
  | { type: "go-next-month" }
  | { type: "go-prev-month" }
  | { type: "modal-regular" }
  | { type: "modal-others" }
  | { type: "close-modal" }
  | { type: "new-regular"; meeting: Meeting; duration: Duration }
  | { type: "new-others"; meeting: Meeting };

export const MeetingsReducer: Reducer<State, Action> = (
  state: State,
  action: Action,
) => {
  if (["abort", "update", "refresh", "new"].some((v) => v === action.type)) {
    return { ...state, loading: ["fetching"] };
  }
  if (action.type === "go-next-month") {
    return { ...state, showing: state.showing.next() };
  }
  if (action.type === "go-prev-month") {
    return { ...state, showing: state.showing.prev() };
  }
  if (action.type === "close-modal") {
    return { ...state, creationModal: "none" };
  }
  if (action.type === "modal-regular") {
    return { ...state, creationModal: "regular" };
  }
  if (action.type === "modal-others") {
    return { ...state, creationModal: "others" };
  }
  return state;
};

const apiRoot = process.env.API_ROOT || "http://localhost:3080/";

type Middleware = (
  state: State,
  dispatch: (action: Action) => void,
) => (action: Action) => Promise<void>;

const connect = (...wares: Middleware[]): Middleware =>
  wares.length === 1
    ? wares[0]
    : (state: State, dispatch: (action: Action) => void) =>
        wares[0](state, connect(...wares.slice(1))(state, dispatch));

const PostMiddleware: Middleware = (
  state: State,
  dispatch: (action: Action) => void,
) => async (action: Action) => {
  dispatch(action);
  if (action.type === "new-regular") {
    const { from, to } = action.duration;
    const res = await fetch(apiRoot + "meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "Regular",
        name: action.meeting.name,
        from,
        to,
      }),
    });
    if (!res.ok) {
      console.error({ action });
    }
    return;
  }
  if (action.type === "new-others") {
    const res = await fetch(apiRoot + "meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "Others",
        name: action.meeting.name,
        date: action.meeting.date,
      }),
    });
    if (!res.ok) {
      console.error({ action });
    }
    return;
  }
};

export const MeetingsMiddleware = connect(PostMiddleware);
