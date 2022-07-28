import type { Request, Response } from 'express';
import type { Token } from 'keycloak-connect';

function keycloakProtect(keycloakRoles: string[]) {
  return (accessToken: Token, request: Request, _response: Response) => {
    const hasAllRoles = keycloakRoles.every(role => accessToken.hasRole(role));

    request.keycloakRolesDefined = keycloakRoles;

    return hasAllRoles;
  }
}

export { keycloakProtect };
