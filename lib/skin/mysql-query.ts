import { MeetingQuery } from '..';
import { Connection } from 'mysql';

type MySQLQueryNode = (con: Connection) => string;

export const MySQLQuery: MeetingQuery<MySQLQueryNode> = {
  everything: () => _con => '',
  isId: id => con => '`id` = ' + con.escape(id),
  named: name => con => '`name` = ' + con.escape(name),
  isKind: kind => con => '`kind` = ' + con.escape(kind),
  holdBefore: date => con => '`date` <= ' + con.escape(date),
  holdAfter: date => con => '`date` >= ' + con.escape(date),
  isExpired: isExpired => con => '`expired` = ' + con.escape(isExpired),
  and: (left, right) => con => '(' + left(con) + ' AND ' + right(con) + ')',
  or: (left, right) => con => '(' + left(con) + ' OR ' + right(con) + ')',
  not: right => con => 'NOT (' + right(con) + ')',
};
