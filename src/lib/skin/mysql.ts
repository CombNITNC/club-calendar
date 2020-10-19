import mysql, { Connection } from "mysql";
import {
  Meeting,
  Repository,
  MeetingKind,
  MeetingQueryNode,
  transform,
  MySQLQuery,
} from "..";

type Param = {
  id: string;
  kind: MeetingKind;
  name: string;
  date: Date;
  expired: boolean;
};

const toParam = (m: Meeting): Param => {
  const p = { ...m };
  delete p.id;
  return {
    ...p,
    id: m.id,
  };
};

const fromParam = (p: Param): Meeting => {
  const m = { ...p };
  delete m.id;
  return { id: p.id, ...m };
};

const uri = process.env.DB_HOST || "127.0.0.1";
const user = process.env.DB_USER || "meetings";

export class MySQLRepository implements Repository {
  private con: Connection;

  constructor() {
    console.log("connecting to DB " + process.env.DB_HOST);
    this.con = mysql.createConnection({
      host: uri,
      user,
      password: process.env.DB_PASS,
      database: "meetings",
      insecureAuth: true,
    });
    this.con.connect((e) => {
      if (e) {
        console.error(`DB connection failure: ${e}`);
        return;
      }
      console.log("connected to DB " + process.env.DB_HOST);
    });
  }

  save(...con: Meeting[]): Promise<string[]> {
    const promises = con.map((m) => {
      const set = { ...m, id: m.id };
      delete set.id;
      return new Promise<string>((resolve, reject) =>
        this.con.query(
          "INSERT INTO `meetings` SET ?",
          set,
          (e, result: Param) => (e ? reject(e) : resolve(result.id)),
        ),
      );
    });
    return Promise.all(promises);
  }

  get(query: MeetingQueryNode): Promise<Meeting[]> {
    const additionalQuery =
      query[0] === "everything"
        ? ""
        : "WHERE " + transform(query, MySQLQuery)(this.con);

    return new Promise((resolve, reject) => {
      this.con.query(
        "SELECT * FROM `meetings`" + additionalQuery,
        (e, results: Param[]) =>
          e ? reject(e) : resolve(results.map(fromParam)),
      );
    });
  }

  find(id: string): Promise<Meeting> {
    return new Promise((resolve, reject) => {
      this.con.query(
        "SELECT * FROM `meetings` WHERE `id` = ? LIMIT 1",
        [id],
        (e, results: Param[]) => {
          return e ? reject(e) : resolve(fromParam(results[0]));
        },
      );
    });
  }

  async update(...con: Meeting[]): Promise<void> {
    await Promise.all(
      con.map(
        (m) =>
          new Promise((resolve, reject) => {
            this.con.query(
              "UPDATE `meetings` SET ? WHERE `id` = ?",
              [toParam(m), m.id],
              (e) => (e ? reject(e) : resolve()),
            );
          }),
      ),
    );
  }
}
