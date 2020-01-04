export class Errors {
  private errors: { [name: string]: string } = {};
  addError(name: string, detail: string) {
    this.errors[name] = detail;
  }

  getErrors(): { [name: string]: string } {
    return this.errors;
  }
}

export type Schema<T> = {
  [K in keyof T]: { val: (value: any) => value is T[K]; message: string };
};

export type Input<T> = { [K in keyof T]: T[K] };

export function Form<T>(s: Schema<T>): (input: Input<T>) => Errors {
  return (input: Input<T>) => {
    const e = new Errors();
    for (const key in s) {
      if (!s[key].val(input[key])) {
        e.addError(key, s[key].message);
      }
    }
    return e;
  };
}
