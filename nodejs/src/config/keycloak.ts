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

Keycloak.prototype.accessDenied = async (request: Request, response: Response) => {
  if (!request.headers.authorization) {
    return response.status(401).json(
      new AppError({
        errorCode: 'token.empty',
        message: 'Token is missing.'
      })
    );
  }

  if (!request.kauth?.grant) {
    return response.status(401).json(
      new AppError({
        errorCode: 'token.invalid',
        message: 'You are not authorized to access this resource, please check the sent token and make sure it is a valid token.'
      })
    );
  }

  _keycloak.storeGrant(request.kauth.grant as any, request, response);

  const getGrant = await _keycloak.getGrant(request, response);

  if (getGrant.isExpired()) {
    return response.status(401).json(
      new AppError({
        errorCode: 'token.expired',
        message: 'Expired token, please enter a valid token to continue.'
      })
    );
  }

  const hasAllRolesDefinedToContinue = request.keycloakRolesDefined.every(
    role => getGrant.access_token?.hasRole(role)
  );

  if (!hasAllRolesDefinedToContinue) {
    const myCurrentRoles = request.
      kauth?.
      grant?.
      access_token?.
      content?.
      resource_access?.
      nodejs?.
      roles?.join(', ') || [];
    const requiredRoles = request.keycloakRolesDefined.join(', ');

    return response.status(401).json(
      new AppError({
        errorCode: 'roles.required',
        message: `You must have all roles to continue, you have [${myCurrentRoles}], but it is necessary to have these roles [${requiredRoles}].`
      })
    );
  }

  return response.status(401).json(
    new AppError({
      errorCode: 'token.invalid',
      message: 'Invalid token, enter a new token.'
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
