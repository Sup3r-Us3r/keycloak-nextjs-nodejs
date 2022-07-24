import { Router } from 'express';
import { getKeycloak } from '../config/keycloak';

const router = Router();
const keycloak = getKeycloak();

router.get('/anonymous', (request, response) => {
  return response.send('Hello Anonymous');
});

router.get('/user', keycloak.protect('user'), (request, response) => {
  return response.send('Hello User');
});

router.get('/admin', keycloak.protect('admin'), (request, response) => {
  return response.send('Hello Admin');
});

router.get(
  '/all-user',
  keycloak.protect(['user', 'admin'] as any),
  (request, response) => {
    console.log(request.kauth.grant.access_token.token);

    return response.send('Hello All User');
  }
);

export { router as routes };
