declare namespace Express {
  export interface Request {
    keycloakRolesDefined: string[];
    kauth: {
      grant: {
        access_token: {
          token: string;
          clientId: string;
          header: {
            alg: string;
            typ: string;
            kid: string;
          };
          content: {
            exp: number;
            iat: number;
            jti: string;
            iss: string;
            aud: string;
            sub: string;
            typ: string;
            azp: string;
            session_state: string;
            acr: string;
            'allowed-origins': string[];
            realm_access: {
              roles: string[];
            };
            resource_access: {
              nodejs: {
                roles: string[];
              };
              account: {
                roles: string[];
              }
            };
            scope: string;
            sid: string;
            email_verified: boolean;
            preferred_username: string;
          };
          signature: Buffer | any;
          signed: string;
        };
      }
    };
  }
}
