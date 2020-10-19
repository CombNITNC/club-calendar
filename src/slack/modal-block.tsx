/** @jsx JSXSlack.h */
import JSXSlack, {
  Modal,
  Input,
  Select,
  Option,
  DatePicker,
} from "@speee-js/jsx-slack";

export default () =>
  JSXSlack(
    <Modal
      title="集会の新規作成"
      submit="つくる"
      close="やめる"
      callbackId="create"
    >
      <Select
        blockId="0"
        name="kind"
        label="種類"
        placeholder="定例会 or その他の集会"
        required
      >
        <Option value="Regular">定例会</Option>
        <Option value="Others">その他の集会</Option>
      </Select>
      <Input
        blockId="1"
        type="text"
        name="name"
        label="名前"
        placeholder="イカした名前"
        required
      />
      <DatePicker
        blockId="2"
        initialDate={new Date()}
        name="date"
        label="日付"
        placeholder="集会を開く日付"
        required
      />
    </Modal>,
  );
