declare module 'postgres' {
  export type QueryResult = object[];
  export type QueryTemplate = (
    template: TemplateStringsArray,
    ...placeHolders: string[]
  ) => Promise<QueryResult>;

  export type ConnectionOption = {
    host: string;
    port: number;
    path: string;
    database: string;
    username: string;
    password: string;
    ssl: boolean;
    max: number;
    timeout: number;
    types: any[];
    onnotice: () => void;
    onparameter: (key: string, value: any) => void;
    debug: (connection: Connection, query: Query, parameters: any[]) => void;
    transform: {
      column: (name: string) => string;
      value: (value: any) => any;
      row: (row: any[]) => any[];
    };
    connection: { [key: string]: string };
  };
  export default function(
    url: string,
    option: Partial<ConnectionOption>
  ): QueryTemplate;
}
