import { AbortOutput } from '../op/abort';
import { CreateOutput } from '../op/create';
import { UpdateOutput } from '../op/update';
import { FetchOutput } from '../op/fetch';

export type Repository = AbortOutput &
  CreateOutput &
  FetchOutput &
  UpdateOutput;
