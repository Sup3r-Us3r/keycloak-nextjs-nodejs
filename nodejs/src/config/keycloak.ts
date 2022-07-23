import session from 'express-session';
import Keycloak, { Keycloak as KeycloakType, KeycloakConfig } from 'keycloak-connect';

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

function getKeycloak(): KeycloakType {
  if (!_keycloak) {
    console.log('\nInitializing Keycloak...\n');

    _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

    return _keycloak;
  }

  return _keycloak;
}

export { getKeycloak, memoryStore };
