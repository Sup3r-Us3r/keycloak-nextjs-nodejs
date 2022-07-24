import express from 'express';
import session from 'express-session';
import cors from 'cors';

import { getKeycloak, memoryStore } from './config/keycloak';
import { routes } from './routes';

const app = express();
const keycloak = getKeycloak();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  // Generate secret: openssl rand -base64 32
  secret: 'IECSsT+IBPxmfuULAqrDebeXFCWSFBDDTb6FpEQ+Kd4=',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
  // cookie: {
  //   maxAge: 1000 * 60 * 10 // 10min
  // }
}));
app.use(keycloak.middleware());

app.use(routes);

export { app };
