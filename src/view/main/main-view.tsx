import { useReducer, FC } from "react";

import { Meeting, YearMonth, Duration } from "../../lib";

import { Menu } from "../components/creation/menu";
import { Title } from "../components/text";

import { Calendar } from "./calendar";
import { MeetingsReducer, MeetingsMiddleware } from "./main-reducer";
import { ModalOverlay } from "./modal-overlay";

const App: FC<{ defaultShowing: YearMonth }> = ({ defaultShowing }) => {
  const [state, dispatchRoot] = useReducer(MeetingsReducer, {
    creationModal: "none",
    showing: defaultShowing,
  });
  const dispatch = MeetingsMiddleware(state, dispatchRoot);

  return (
    <>
      <Title>部内カレンダー</Title>
      <Calendar
        showing={state.showing}
        disabled={false}
        goNext={() => dispatch({ type: "go-next-month" })}
        goPrev={() => dispatch({ type: "go-prev-month" })}
      />
      <Menu
        items={["新しい定例会", "新しいその他の集会"]}
        onClick={(i) => {
          switch (i) {
            case 0:
              dispatch({ type: "modal-regular" });
              break;
            case 1:
              dispatch({ type: "modal-others" });
              break;
          }
        }}
      />
      <ModalOverlay
        kind={state.creationModal}
        close={() => dispatch({ type: "close-modal" })}
        newRegular={({ name, from, to }) =>
          dispatch({
            type: "new-regular",
            meeting: Meeting.regular(name, from),
            duration: new Duration(from, to),
          })
        }
        newOthers={({ name, date }) =>
          dispatch({
            type: "new-others",
            meeting: Meeting.others(name, date),
          })
        }
      />
    </>
  );
};

export default App;
