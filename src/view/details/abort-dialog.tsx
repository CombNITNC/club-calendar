import { FC } from "react";
import { Modal } from "../components/modal";
import { ShadowedButton, ShadowedRedButton } from "../components/button";
import Link from "next/link";

export const AbortDialog: FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => (
  <>
    <Modal close={onCancel}>
      この集会を中止してもよろしいですか？
      <div>
        <ShadowedButton onClick={onCancel}>中止しない</ShadowedButton>
        <Link href="/">
          <ShadowedRedButton onClick={onConfirm}>中止する</ShadowedRedButton>
        </Link>
      </div>
    </Modal>
    <style jsx>{`
      div {
        display: flex;
        justify-content: space-around;
      }
    `}</style>
  </>
);
