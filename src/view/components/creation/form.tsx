import { FC, useState, useEffect, ReactNode } from 'react';
import { Title } from '../text';
import { ShadowedButton } from '../button';
import {
  StringScheme,
  NumberScheme,
  DateScheme,
  OptionScheme,
  CheckScheme,
  formElementBody,
} from './form/body';

export type SchemeKind = 'string' | 'number' | 'date' | 'option' | 'check';

export type Scheme =
  | StringScheme
  | NumberScheme
  | DateScheme
  | OptionScheme
  | CheckScheme;

export type Schema = {
  [key: string]: Scheme | Schema;
};

export type SchemeSetter = (ref: Scheme) => (input: Scheme['value']) => void;

const isScheme = (v: Scheme | Schema): v is Scheme =>
  typeof v === 'object' && 'type' in v;

const formElement = (
  [key, v]: [string, Scheme | Schema],
  setter: SchemeSetter
) => {
  if (!isScheme(v)) {
    return (
      <div key={key}>
        <div>{key}</div>
        <div className="paragraph">{formElements(v, setter)}</div>
        <style jsx>{`
          .paragraph {
            margin: 0 auto;
            padding: 0 0 0 1em;
          }
        `}</style>
      </div>
    );
  }
  const body = formElementBody(key, v, setter);
  return (
    <div key={key}>
      <label>
        {key}
        {body}
      </label>
    </div>
  );
};

const formElements = (schema: Schema, setter: SchemeSetter): ReactNode[] =>
  Object.entries(schema).map((entry) => formElement(entry, setter));

const ErrorList: FC<{ errors: string[] }> = ({ errors }) => (
  <ul>
    {errors.map((e) => (
      <li key={e}>{e}</li>
    ))}
  </ul>
);

const SentTip: FC<{ sent: boolean }> = ({ sent }) =>
  sent ? <span>送信しました</span> : <></>;

const makeSetter = <S extends Schema>(
  value: S,
  setValue: (newValue: S) => void,
  setErrors: (newErrors: string[]) => void,
  validator: (value: any) => string[]
) => (ref: Scheme) => (input: Scheme['value']) => {
  const cloned = { ...value };
  ref.value = input;

  const newErrors = validator(value);
  if (newErrors.length !== 0) {
    setValue(cloned); // Go back to as before
  }
  setErrors(newErrors);
};

const makeSendHandler = <S extends Schema, T>(
  validator: (value: any) => string[],
  value: S,
  setSent: (newValue: boolean) => void,
  onSend: (value: T) => void,
  exporter: (value: S) => T
) => () => {
  if (0 < validator(value).length) {
    return;
  }
  setSent(true);
  onSend(exporter(value));
};

export type FormProps<T> = {
  onSend: (value: T) => void;
  title: string;
  sendLabel: string;
};

export const FormBuilder = <S extends Schema, T>(
  defaultValue: S,
  validator: (value: any) => string[],
  exporter: (value: S) => T
): FC<FormProps<T>> => ({ onSend, title, sendLabel }) => {
  const timeoutDelay = 1500;

  const [sent, setSent] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [errors, setErrors] = useState<string[]>([]);

  const setter = makeSetter<S>(value, setValue, setErrors, validator);

  useEffect(() => {
    const timer = setTimeout(() => setSent(false), timeoutDelay);
    return () => clearTimeout(timer);
  }, [sent]);

  const sendHandler = makeSendHandler<S, T>(
    validator,
    value,
    setSent,
    onSend,
    exporter
  );

  return (
    <>
      <Title>{title}</Title>
      {formElements(value, setter)}
      <ShadowedButton onClick={sendHandler}>{sendLabel}</ShadowedButton>
      <ErrorList errors={errors} />
      <SentTip sent={sent} />
      <style jsx>{`
        span {
          color: green;
          font-size: 12pt;
        }
        li {
          color: darkred;
        }
      `}</style>
    </>
  );
};
