import { AbortInput } from '../op/abort';
import { CreateInput } from '../op/create';
import { FetchInput } from '../op/fetch';
import { UpdateInput } from '../op/update';

export type Client = AbortInput & CreateInput & FetchInput & UpdateInput;
