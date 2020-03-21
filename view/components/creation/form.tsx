import { FC, ChangeEvent, useState, useEffect } from 'react';
import { Title } from '../text';

export type SchemeKind = 'string' | 'number' | 'date' | 'option' | 'check';

export type Scheme = {
  type: SchemeKind;
  value: any;
};

export type Schema = {
  [key: string]: Scheme | Schema;
};

const isScheme = (v: Scheme | Schema): v is Scheme =>
  typeof v === 'object' && 'type' in v;

const schemeElement = (
  key: string,
  v: Scheme,
  setter: (ref: Scheme) => (e: ChangeEvent<HTMLInputElement>) => void
) => {
  switch (v.type) {
    case 'string':
      return <input defaultValue={v.value} onChange={setter(v)} />;
    case 'date':
      return (
        <input
          type="datetime-local"
          defaultValue={v.value}
          onChange={setter(v)}
        />
      );
    case 'number':
      return (
        <input type="number" defaultValue={v.value} onChange={setter(v)} />
      );
    case 'check':
      return (
        <input type="checkbox" defaultValue={v.value} onChange={setter(v)} />
      );
    case 'option':
      return (
        <>
          <input
            defaultValue={v.value[0]}
            list={`list-${key}`}
            onChange={setter(v)}
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
  setter: (ref: Scheme) => (e: ChangeEvent<HTMLInputElement>) => void
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
): FC<{ onSend: (value: T) => void; title: string }> {
  return ({ onSend, title }) => {
    const [sent, setSent] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const [errors, setErrors] = useState<string[]>([]);

    const setter = (ref: Scheme) => (e: ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
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
        <button
          onClick={() => {
            if (0 < validator(value).length) {
              return;
            }
            setSent(true);
            onSend(exporter(value));
          }}
        >
          送信
        </button>
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
