import express, { Request, Response } from 'express';

import {
  ExpressClient,
  RealRepository,
  FetchService,
  CreateService,
  UpdateService,
  AbortService,
} from '../lib';

const app = express();

const withLib = (
  fn: (client: ExpressClient, repository: RealRepository) => void
) => (req: Request, res: Response) => {
  const client = new ExpressClient(req, res);
  fn(client, RealRepository.inst);
};

app.get('/api/meetings', withLib(FetchService));

app.post('/api/meetings', withLib(CreateService));

app.patch('/api/meetings/:id', withLib(UpdateService));

app.patch('/api/meetings/:id/expire', withLib(AbortService));

const port = process.env.API_PORT || 3000;

app.listen(port, () => console.log(`API Server is listening on ${port}`));
