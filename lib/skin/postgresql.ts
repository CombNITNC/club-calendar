import postgres, { QueryTemplate } from 'postgres';

import { Repository } from '../abst/repository';
import { Meeting } from '../exp/meeting';
import { MeetingQueryNode } from '../abst/meeting-query';

const uri = process.env.DB_HOST || '127.0.0.1';
const user = process.env.DB_USER || 'meetings';

export class PostgreSQLRepository implements Repository {
  private sql: QueryTemplate;

  constructor() {
    this.sql = postgres(uri, {
      username: user,
    });
  }

  find(id: string): Promise<Meeting> {
    throw new Error('Method not implemented.');
  }
  update(...meetings: Meeting[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  save(...meetings: Meeting[]): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  get(query: MeetingQueryNode): Promise<Meeting[]> {
    throw new Error('Method not implemented.');
  }
}
