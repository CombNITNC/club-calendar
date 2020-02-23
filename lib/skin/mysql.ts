import mysql, { Connection } from 'mysql';
import {
  Meeting,
  Duration,
  Repository,
  MeetingKind,
  MeetingQueryNode,
  transform,
} from '..';
import { MySQLQuery } from './mysql-query';

type Param = [string, MeetingKind, string, Date, boolean];

const toParam = (m: Meeting): Param => [
  m._id,
  m.kind,
  m.name,
  m.date,
  m.expired,
];

const fromParam = (p: Param): Meeting => ({
  _id: p[0],
  kind: p[1],
  name: p[2],
  date: p[3],
  expired: p[4],
});

const uri = process.env.DB_HOST || '127.0.0.1';
const user = process.env.DB_USER || 'meetings';

export class MySQLRepository implements Repository {
  private con: Connection;

  constructor() {
    console.log('connecting to DB ' + process.env.DB_HOST);
    this.con = mysql.createConnection({
      host: uri,
      user,
      password: process.env.DB_PASS,
      database: 'meetings',
      insecureAuth: true,
    });
    this.con.connect(e => {
      if (e) {
        console.error(`DB connection failure: ${e}`);
        return;
      }
      console.log('connected to DB ' + process.env.DB_HOST);
    });
  }

  save(...con: Meeting[]): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const params = con.reduce(
        (prev, curr) => [...prev, toParam(curr)],
        [] as Param[]
      );
      this.con.query(
        'INSERT INTO `meetings` (id, kind, name, date, expired) VALUES ?',
        params,
        (e, results: Meeting[]) =>
          e ? reject(e) : resolve(results.map(p => p._id))
      );
    });
  }

  get(query: MeetingQueryNode): Promise<Meeting[]> {
    const additionalQuery =
      query[0] === 'everything'
        ? ''
        : 'WHERE ' + transform(query, MySQLQuery)(this.con);

    return new Promise((resolve, reject) => {
      this.con.query(
        'SELECT * FROM `meetings`' + additionalQuery,
        (e, results: Meeting[]) =>
          e ? reject(e) : resolve(results.map(e => ({ ...e })))
      );
    });
  }

  find(id: string): Promise<Meeting> {
    return new Promise((resolve, reject) => {
      this.con.query(
        'SELECT * FROM `meetings` WHERE `id` = ?',
        [id],
        (e, results: Param[]) => {
          if (e) reject(e);
          const found = results.map(fromParam);
          if (found.length != 1) reject('no such mettings found');
          resolve(found[0]);
        }
      );
    });
  }

  async update(...con: Meeting[]): Promise<void> {
    await Promise.all(
      con.map(
        m =>
          new Promise((resolve, reject) => {
            this.con.query(
              'UPDATE `meetings` SET ? WHERE `id` = ?',
              [toParam(m), m._id],
              e => (e ? reject(e) : resolve())
            );
          })
      )
    );
  }
}
