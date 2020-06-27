import { FormBuilder } from './form';
import { DateString } from '../../../lib';

const schema = {
  名前: {
    type: 'string' as const,
    value: '',
  },
  期間: {
    開始: {
      type: 'date' as const,
      value: new DateString(new Date()).toDateTimeStrings(),
    },
    終了: {
      type: 'date' as const,
      value: new DateString(new Date()).toDateTimeStrings(),
    },
  },
};

export const Regular = FormBuilder(
  schema,
  (value: any) => {
    const errors: string[] = [];
    if (value['名前'].value == '' || value['名前'].value == null) {
      errors.push('名前を入力してください');
    }
    try {
      const [start, end] = ['開始', '終了'].map((k) =>
        DateString.fromDateTimeStrings(value['期間'][k].value)
          .toDate()
          .getTime()
      );
      if (start >= end) {
        errors.push('終了日は開始日より後にしてください');
      }
    } catch {
      errors.push('日付の入力がおかしいです');
    }
    return errors;
  },
  (v: typeof schema) => ({
    name: v['名前'].value,
    from: DateString.fromDateTimeStrings(v['期間']['開始'].value).toDate(),
    to: DateString.fromDateTimeStrings(v['期間']['終了'].value).toDate(),
  })
);
