import { FC } from "react";

import { Modal } from "../components/modal";
import { Regular } from "../components/creation/regular";
import { Others } from "../components/creation/others";

import { ModalKind } from "./main-reducer";

export const ModalOverlay: FC<{
  kind: ModalKind;
  close: () => void;
  newRegular: (v: { name: string; from: Date; to: Date }) => void;
  newOthers: (v: { name: string; date: Date }) => void;
}> = ({ kind, close, newRegular, newOthers }) => {
  switch (kind) {
    case "regular":
      return (
        <Modal close={close}>
          <Regular title="新しい定例会" onSend={newRegular} sendLabel="作成" />
        </Modal>
      );
    case "others":
      return (
        <Modal close={close}>
          <Others
            title="新しいその他の集会"
            onSend={newOthers}
            sendLabel="作成"
          />
        </Modal>
      );
    default:
      return <></>;
  }
};
