import { Form } from './Form';

const schema = {
  名前: {
    type: 'string' as const,
    value: '',
  },
  日時: {
    type: 'date' as const,
    value: '2020-01-01',
  },
};

export const Others = Form(
  schema,
  (v: any) => {
    if (v['名前'].value === '') {
      return false;
    }
    return true;
  },
  v => ({ name: v['名前'].value, date: new Date(v['日時'].value) })
);