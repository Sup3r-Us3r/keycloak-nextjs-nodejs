import { Router, Request } from 'express';
import { Token } from 'keycloak-connect';

import { getKeycloak } from '../config/keycloak';

const router = Router();
const keycloak = getKeycloak();

router.get('/anonymous', (_request, response) => {
  return response.send('Hello Anonymous');
});

router.get('/user', keycloak.protect('user'), (_request, response) => {
  return response.send('Hello User');
});

router.get('/admin', keycloak.protect('admin'), (_request, response) => {
  return response.send('Hello Admin');
});

router.get(
  '/all-user',
  keycloak.protect(
    (accessToken: Token, _request: Request) => {
      return accessToken.hasRole('user') && accessToken.hasRole('admin');
    }
  ),
  (request, response) => {
    console.log(request.kauth.grant.access_token.token);

    return response.send('Hello All User');
  }
);

export { router as routes };
