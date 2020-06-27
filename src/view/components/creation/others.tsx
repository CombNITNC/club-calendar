import { FormBuilder } from './form';
import { DateString } from '../../../lib';

const schema = {
  名前: {
    type: 'string' as const,
    value: '',
  },
  日時: {
    type: 'date' as const,
    value: new DateString(new Date()).toDateTimeStrings(),
  },
};

export const Others = FormBuilder(
  schema,
  (v: any) => {
    const errors: string[] = [];
    if (v['名前'].value === '') {
      errors.push('名前を入力してください');
    }
    if (v['日時'].value === '') {
      errors.push('正常な日時を入力してください');
    }
    return errors;
  },
  (v) => ({
    name: v['名前'].value,
    date: DateString.fromDateTimeStrings(v['日時'].value).toDate(),
  })
);
