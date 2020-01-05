import { Form, Schema } from './Form';
import { DateString } from '../../lib/meeting';

const schema = {
  名前: {
    type: 'string' as const,
    value: '',
  },
  期間: {
    開始: {
      type: 'date' as const,
      value: '2020-01-01',
    },
    終了: {
      type: 'date' as const,
      value: '2020-01-01',
    },
  },
};

export const Regular = Form(
  schema,
  (value: any) => {
    if (value['名前'].value == '' || value['名前'].value == null) {
      return false;
    }
    try {
      const [start, end] = ['開始', '終了'].map(k =>
        DateString.to(value['期間'][k].value)
          .toDate()
          .getTime()
      );
      if (start >= end) {
        return false;
      }
    } catch {
      return false;
    }
    return true;
  },
  (v: typeof schema) => ({
    name: v['名前'].value,
    date: new Date(v['期間']['開始'].value),
  })
);
