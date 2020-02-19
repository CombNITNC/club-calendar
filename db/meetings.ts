import mysql, { Connection } from 'mysql';

const uri = process.env.DB_HOST || 'mysql://meetings@localhost:3306';

let con: Connection | null = null;

export const GetMeetings = (): Connection => {
  if (con == null) {
    console.log('connecting to DB ' + process.env.DB_HOST);
    con = mysql.createConnection({
      host: uri,
      password: process.env.DB_PASS,
    });
    con.connect(e => {
      if (e) console.error(e.message);
      console.log('connected to DB ' + process.env.DB_HOST);
    });
    con.on('error', e => console.error(`DB connection failure ${e}`));
  }
  return con;
};
