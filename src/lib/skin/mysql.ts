import mysql, { Connection } from "mysql";
import {
  Meeting,
  Repository,
  MeetingQueryNode,
  transform,
  MySQLQuery,
} from "..";
import { SerializedMeeting } from "../exp/meeting";

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
      const set = { ...m };
      return new Promise<string>((resolve, reject) =>
        this.con.query(
          "INSERT INTO `meetings` SET ?",
          set,
          (e, result: SerializedMeeting) =>
            e ? reject(e) : resolve(result.id),
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
        (e, results: SerializedMeeting[]) =>
          e ? reject(e) : resolve(results.map(Meeting.deserialize)),
      );
    });
  }

  find(id: string): Promise<Meeting> {
    return new Promise((resolve, reject) => {
      this.con.query(
        "SELECT * FROM `meetings` WHERE `id` = ? LIMIT 1",
        [id],
        (e, results: SerializedMeeting[]) => {
          return e ? reject(e) : resolve(Meeting.deserialize(results[0]));
        },
      );
    });
  }

  async update(...con: Meeting[]): Promise<void> {
    await Promise.all(
      con.map(
        (m) =>
          new Promise<void>((resolve, reject) => {
            this.con.query(
              "UPDATE `meetings` SET ? WHERE `id` = ?",
              [Meeting.serialize(m), m.id],
              (e) => (e ? reject(e) : resolve()),
            );
          }),
      ),
    );
  }
}
