import { Router } from 'express';

const router = Router();

router.get('/anonymous', (request, response) => {
  return response.send('Hello Anonymous');
});

router.get('/user', (request, response) => {
  return response.send('Hello User');
});

router.get('/admin', (request, response) => {
  return response.send('Hello Admin');
});

router.get('/all-user', (request, response) => {
  return response.send('Hello All User');
});

export { router as routes };
