import { FC, useState, useMemo } from 'react';
import { Form } from './Form';
import { DateString } from '../../lib/meeting';

const schema = {
  name: {
    val: (value: any): value is string => typeof value === 'string',
    message: 'name must be string',
  },
  start: {
    val: (value: any): value is DateString => !validateDateString(value),
    message: 'start must be DateString',
  },
  end: {
    val: (value: any): value is DateString => !validateDateString(value),
    message: 'end must be DateString',
  },
};
const validator = Form(schema);

export const Regular: FC = () => {
  const [inputs, setInputs] = useState({
    name: '定例会',
    start: new DateString(new Date()),
    end: (() => {
      const _d = new Date();
      _d.setMonth(_d.getMonth() + 1);
      return new DateString(_d);
    })(),
  });
  const errors = useMemo(() => validator(inputs), [inputs]);

  return (
    <>
      <div>
        <label>名前</label>
        <input
          name="name"
          placeholder="定例会の名前を入力"
          defaultValue={inputs.name}
          required
          onChange={e => setInputs({ ...inputs, name: e.target.value })}
        />
      </div>
      <div>
        <label>期間</label>
        <div>
          <label>開始</label>
          <input
            name="start"
            placeholder="定例会が始まる日付を入力"
            type="date"
            defaultValue={inputs.start.toFormValueString()}
            required
            onChange={e => {
              setInputs({
                ...inputs,
                start: DateString.to(e.target.value),
              });
            }}
          />
        </div>
        <div>
          <label>終了</label>
          <input
            name="end"
            placeholder="定例会が終わる日付を入力"
            type="date"
            defaultValue={inputs.end.toFormValueString()}
            required
            onChange={e => {
              setInputs({ ...inputs, end: DateString.to(e.target.value) });
            }}
          />
        </div>
      </div>
      <div>
        {Object.entries(errors.getErrors()).map(([key, value]) => {
          return <p key={key}>{value}</p>;
        })}
      </div>
      <button>作成</button>
      <style jsx>{`
        p {
          color: red;
        }
      `}</style>
    </>
  );
};
