import { FC, ChangeEvent, useState, useEffect } from 'react';
import { Title } from '../text';
import { ShadowedButton } from '../button';

export type SchemeKind = 'string' | 'number' | 'date' | 'option' | 'check';

export type Scheme =
  | { type: 'string'; value: string }
  | { type: 'number'; value: number }
  | {
      type: 'date';
      value: {
        date: string;
        time: string;
      };
    }
  | { type: 'option'; value: string[] }
  | { type: 'check'; value: boolean };

export type Schema = {
  [key: string]: Scheme | Schema;
};

const isScheme = (v: Scheme | Schema): v is Scheme =>
  typeof v === 'object' && 'type' in v;

const schemeElement = (
  key: string,
  v: Scheme,
  setter: (ref: Scheme) => (input: Scheme['value']) => void
) => {
  switch (v.type) {
    case 'string':
      return (
        <input
          defaultValue={v.value}
          onChange={e => setter(v)(e.target.value)}
        />
      );
    case 'date':
      return (
        <>
          <input
            type="date"
            defaultValue={v.value.date}
            onChange={e => setter(v)({ ...v.value, date: e.target.value })}
          />
          <input
            type="time"
            defaultValue={v.value.time}
            onChange={e => setter(v)({ ...v.value, time: e.target.value })}
          />
        </>
      );
    case 'number':
      return (
        <input
          type="number"
          defaultValue={v.value}
          onChange={e => setter(v)(e.target.value)}
        />
      );
    case 'check':
      return (
        <input
          type="checkbox"
          checked={v.value}
          onChange={e => setter(v)(e.target.value)}
        />
      );
    case 'option':
      return (
        <>
          <input
            defaultValue={v.value[0]}
            list={`list-${key}`}
            onChange={e => setter(v)(e.target.value)}
          />
          <datalist id={`list-${key}`}>
            {v.value.map((m: string) => (
              <option value={m}></option>
            ))}
          </datalist>
        </>
      );
    default:
      return <input />;
  }
};

const formElements = (
  schema: Schema,
  setter: (ref: Scheme) => (input: Scheme['value']) => void
): JSX.Element[] => {
  return Object.entries(schema).map(([key, v]) => {
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
    const body = schemeElement(key, v, setter);
    return (
      <div key={key}>
        <label>
          {key}
          {body}
        </label>
      </div>
    );
  });
};

export function Form<S extends Schema, T>(
  defaultValue: S,
  validator: (value: any) => string[],
  exporter: (value: S) => T
): FC<{ onSend: (value: T) => void; title: string; sendLabel: string }> {
  return ({ onSend, title, sendLabel }) => {
    const [sent, setSent] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const [errors, setErrors] = useState<string[]>([]);

    const setter = (ref: Scheme) => (input: Scheme['value']) => {
      const cloned = { ...value };
      ref.value = input;

      const newErrors = validator(value);
      if (newErrors.length !== 0) {
        setValue(cloned); // Go back to as before
      }
      setErrors(newErrors);
    };

    useEffect(() => {
      const timer = setTimeout(() => setSent(false), 1500);
      return () => clearTimeout(timer);
    }, [sent]);

    return (
      <>
        <Title>{title}</Title>
        {formElements(value, setter)}
        <ShadowedButton
          onClick={() => {
            if (0 < validator(value).length) {
              return;
            }
            setSent(true);
            onSend(exporter(value));
          }}
        >
          {sendLabel}
        </ShadowedButton>
        <ul>
          {errors.map(e => (
            <li key={e}>{e}</li>
          ))}
        </ul>
        {sent && <span>送信しました</span>}
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
}
