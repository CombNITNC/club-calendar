import { Meeting, DateString } from '../../lib';
import { Form } from '../components/creation/form';

export const detailsForm = (meeting: Meeting) => {
  const schema = {
    名前: {
      type: 'string' as const,
      value: meeting.name,
    },
    日時: {
      type: 'date' as const,
      value: new DateString(meeting.date).toDateTimeStrings(),
    },
  };

  return Form(
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
    v => ({
      ...meeting,
      name: v['名前'].value,
      date: DateString.fromDateTimeStrings(v['日時'].value).toDate(),
    })
  );
};
