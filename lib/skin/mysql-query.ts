import { MeetingQuery } from '../abst/meeting-query';
import { Connection } from 'mysql';

type MySQLQueryBuilder = (con: Connection) => string;

export const MySQLQuery: MeetingQuery<MySQLQueryBuilder> = {
  isId: id => con => '`id` = ' + con.escape(id),
  named: name => con => '`name` = ' + con.escape(name),
  holdBefore: date => con => '`date` <= ' + con.escape(date),
  holdAfter: date => con => '`date` >= ' + con.escape(date),
  isExpired: isExpired => con => '`expired` = ' + con.escape(isExpired),
  and: (left, right) => con => '(' + left(con) + ' AND ' + right(con) + ')',
  or: (left, right) => con => '(' + left(con) + ' OR ' + right(con) + ')',
  not: right => con => 'NOT (' + right(con) + ')',
};
