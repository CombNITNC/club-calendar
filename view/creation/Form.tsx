import { FC, ChangeEvent } from 'react';

export class Errors {
  private errors: { [name: string]: string } = {};
  addError(name: string, detail: string) {
    this.errors[name] = detail;
  }

  getErrors(): { [name: string]: string } {
    return this.errors;
  }
}

export type Scheme = {
  type: 'string' | 'number' | 'date' | 'option';
  value: any;
};

export type Schema = {
  [key: string]: Scheme | Schema;
};

export function Form<S extends Schema, T>(
  defaultValue: S,
  validator: (value: any) => boolean,
  exporter: (value: S) => T
): FC<{ onClick: (value: T) => void }> {
  let value = { ...defaultValue };
  const setter = (ref: Scheme) => (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cloned = { ...value };
    ref.value = input;
    if (!validator(value)) {
      value = cloned; // Go back to as before
      return;
    }
  };
  return ({ onClick }) => (
    <>
      {formElements(value, setter)}
      <button
        onClick={() => {
          if (!validator(value)) {
            return;
          }
          onClick(exporter(value));
        }}
      >
        送信
      </button>
    </>
  );
}

const isScheme = (v: Scheme | Schema): v is Scheme =>
  typeof v === 'object' && 'type' in v;

const formElements = (
  schema: Schema,
  setter: (ref: Scheme) => (e: ChangeEvent<HTMLInputElement>) => void
): JSX.Element[] => {
  return Object.entries(schema).map(([key, v]) => {
    if (!isScheme(v)) {
      return (
        <div key={key}>
          <label>{key}</label>
          {formElements(v, setter)}
        </div>
      );
    }
    let body: JSX.Element;
    switch (v.type) {
      case 'string':
        body = <input defaultValue={v.value} onChange={setter(v)} />;
        break;
      case 'date':
        body = (
          <input type="date" defaultValue={v.value} onChange={setter(v)} />
        );
        break;
      default:
        body = <input />;
        break;
    }
    return (
      <div key={key}>
        <label>{key}</label>
        {body}
      </div>
    );
  });
};
