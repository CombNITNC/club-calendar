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

const uri = process.env.DB_HOST || 'mysql://con@localhost:3306';

export class MySQLRepository implements Repository {
  private con: Connection;

  constructor() {
    console.log('connecting to DB ' + process.env.DB_HOST);
    this.con = mysql.createConnection({
      host: uri,
      password: process.env.DB_PASS,
    });
    this.con.connect(e => {
      if (e) console.error(e.message);
      console.log('connected to DB ' + process.env.DB_HOST);
    });
    this.con.on('error', e => console.error(`DB connection failure ${e}`));
  }

  save(...con: Meeting[]): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const params = con.reduce(
        (prev, curr) => [...prev, toParam(curr)],
        [] as Param[]
      );
      this.con.query(
        'INSERT INTO `con` (id, kind, name, date, expired) VALUES ?',
        params,
        (e, results: Param[]) =>
          e ? reject(e) : resolve(results.map(p => p[0][0]))
      );
    });
  }

  get(query: MeetingQueryNode): Promise<Meeting[]> {
    return new Promise((resolve, reject) => {
      const additionalQuery =
        0 < query.length
          ? 'WHERE ' + transform(query, MySQLQuery)(this.con)
          : '';

      this.con.query(
        'SELECT * FROM `con`' + additionalQuery,
        (e, results: Param[]) =>
          e ? reject(e) : resolve(results.map(fromParam))
      );
    });
  }

  read(duration: Duration): Promise<Meeting[]> {
    const { from, to } = duration;
    return new Promise((resolve, reject) => {
      this.con.query(
        'SELECT * FROM `con` WHERE `date` BETWEEN ? AND ?',
        [from, to],
        (e, results: Param[]) =>
          e ? reject(e) : resolve(results.map(fromParam))
      );
    });
  }

  find(id: string): Promise<Meeting> {
    return new Promise((resolve, reject) => {
      this.con.query(
        'SELECT * FROM `con` WHERE `id` = ?',
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
              'UPDATE `con` SET ? WHERE `id` = ?',
              [toParam(m), m._id],
              e => (e ? reject(e) : resolve())
            );
          })
      )
    );
  }
}
