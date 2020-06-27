import { ReactNode } from 'react';
import { Scheme, SchemeSetter } from '../form';

export type StringScheme = {
  type: 'string';
  value: string;
};

export type NumberScheme = {
  type: 'number';
  value: number;
};

export type DateScheme = {
  type: 'date';
  value: {
    date: string;
    time: string;
  };
};

export type OptionScheme = {
  type: 'option';
  value: string[];
};

export type CheckScheme = {
  type: 'check';
  value: boolean;
};

type InputBuilder<V extends Scheme> = (
  key: string,
  v: V,
  setter: SchemeSetter
) => ReactNode;

const stringInput: InputBuilder<StringScheme> = (_key, v, setter) => (
  <input defaultValue={v.value} onChange={(e) => setter(v)(e.target.value)} />
);

const dateInput: InputBuilder<DateScheme> = (_key, v, setter) => (
  <>
    <input
      type="date"
      defaultValue={v.value.date}
      onChange={(e) => setter(v)({ ...v.value, date: e.target.value })}
    />
    <input
      type="time"
      defaultValue={v.value.time}
      onChange={(e) => setter(v)({ ...v.value, time: e.target.value })}
    />
  </>
);

const optionInput: InputBuilder<OptionScheme> = (key, v, setter) => (
  <>
    <input
      defaultValue={v.value[0]}
      list={`list-${key}`}
      onChange={(e) => setter(v)(e.target.value)}
    />
    <datalist id={`list-${key}`}>
      {v.value.map((m: string) => (
        <option value={m}></option>
      ))}
    </datalist>
  </>
);

const checkInput: InputBuilder<CheckScheme> = (_key, v, setter) => (
  <input
    type="checkbox"
    checked={v.value}
    onChange={(e) => setter(v)(e.target.value)}
  />
);

const numberInput: InputBuilder<NumberScheme> = (_key, v, setter) => (
  <input
    type="number"
    defaultValue={v.value}
    onChange={(e) => setter(v)(e.target.value)}
  />
);

export const formElementBody = (
  key: string,
  v: Scheme,
  setter: SchemeSetter
): ReactNode => {
  switch (v.type) {
    case 'string':
      return stringInput(key, v, setter);
    case 'date':
      return dateInput(key, v, setter);
    case 'number':
      return numberInput(key, v, setter);
    case 'check':
      return checkInput(key, v, setter);
    case 'option':
      return optionInput(key, v, setter);
    default:
      throw new Error(`unknown type of scheme: ${v}`);
  }
};
