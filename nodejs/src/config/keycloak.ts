import type { Request, Response } from 'express';
import session from 'express-session';
import Keycloak, { Keycloak as KeycloakType, KeycloakConfig } from 'keycloak-connect';
import { AppError } from '../errors/AppError';

let _keycloak: KeycloakType;
const memoryStore = new session.MemoryStore();

const keycloakConfig: KeycloakConfig = {
  realm: 'apps',
  resource: 'nodejs',
  'auth-server-url': 'http://localhost:8080/auth',
  'bearer-only': true,
  'confidential-port': 0,
  'ssl-required': 'external'
};

Keycloak.prototype.accessDenied = (request: Request, response: Response) => {
  if (!request.headers.authorization) {
    return response.status(401).json(
      new AppError({
        errorCode: 'token.empty',
        message: 'Token is missing.'
      })
    );
  }

  return response.status(401).json(
    new AppError({
      errorCode: 'token.invalid',
      message: 'You are not authorized to access this resource, please check the sent token and make sure it is a valid token.'
    })
  );
}

function getKeycloak(): KeycloakType {
  if (!_keycloak) {
    console.log('\nInitializing Keycloak...\n');

    _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

    return _keycloak;
  }

  return _keycloak;
}

export { getKeycloak, memoryStore };
