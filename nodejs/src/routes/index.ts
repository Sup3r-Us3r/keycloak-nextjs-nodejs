import { Router } from 'express';

import { getKeycloak } from '../config/keycloak';
import { keycloakProtect } from '../utils/keycloakProtect';

const router = Router();
const keycloak = getKeycloak();

router.get('/anonymous', (_request, response) => {
  return response.send('Hello Anonymous');
});

router.get(
  '/user',
  keycloak.protect(keycloakProtect(['user'])),
  (_request, response) => {
    return response.send('Hello User');
  }
);

router.get(
  '/admin',
  keycloak.protect(keycloakProtect(['admin'])),
  (_request, response) => {
    return response.send('Hello Admin');
  }
);

router.get(
  '/all-user',
  keycloak.protect(keycloakProtect(['user', 'admin'])),
  (request, response) => {
    console.log(request.kauth.grant.access_token.token);

    return response.send('Hello All User');
  }
);

export { router as routes };
