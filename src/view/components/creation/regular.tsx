import { FormBuilder } from "./form";
import { DateString } from "../../../lib";

const schema = {
  名前: {
    type: "string" as const,
    value: "",
  },
  期間: {
    開始: {
      type: "date" as const,
      value: new DateString(new Date()).toDateTimeStrings(),
    },
    終了: {
      type: "date" as const,
      value: new DateString(new Date()).toDateTimeStrings(),
    },
  },
};

export const Regular = FormBuilder(
  schema,
  (value: unknown) => {
    const errors: string[] = [];
    if (
      (value as { 名前: { value: unknown } })["名前"].value == "" ||
      (value as { 名前: { value: unknown } })["名前"].value == null
    ) {
      errors.push("名前を入力してください");
    }
    try {
      const [start, end] = (["開始", "終了"] as const).map((k) =>
        DateString.fromDateTimeStrings(
          (value as {
            期間: {
              [K in "開始" | "終了"]: { value: { date: string; time: string } };
            };
          })["期間"][k].value,
        )
          .toDate()
          .getTime(),
      );
      if (start >= end) {
        errors.push("終了日は開始日より後にしてください");
      }
    } catch {
      errors.push("日付の入力がおかしいです");
    }
    return errors;
  },
  (v: typeof schema) => ({
    name: v["名前"].value,
    from: DateString.fromDateTimeStrings(v["期間"]["開始"].value).toDate(),
    to: DateString.fromDateTimeStrings(v["期間"]["終了"].value).toDate(),
  }),
);
