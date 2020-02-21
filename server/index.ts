import express, { Request, Response } from 'express';

import {
  ExpressClient,
  RealRepository,
  FetchService,
  CreateService,
  UpdateService,
  AbortService,
  OnMemoryRepository,
  Client,
  Repository,
} from '../lib';

const repo = new (process.env.NODE_ENV === 'production'
  ? RealRepository
  : OnMemoryRepository)();

const withLib = (fn: (client: Client, repository: Repository) => void) => (
  req: Request,
  res: Response
) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const client = new ExpressClient(req, res);
  try {
    fn(client, repo);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};

const app = express();

app.get('/meetings', withLib(FetchService));

app.post('/meetings', withLib(CreateService));

app.patch('/meetings/:id', withLib(UpdateService));

app.patch('/meetings/:id/expire', withLib(AbortService));

const port = process.env.API_PORT || 3080;

app.listen(port, () => console.log(`API Server is listening on ${port}`));
