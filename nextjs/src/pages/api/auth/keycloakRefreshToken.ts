import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

interface IKeycloakRefreshTokenParams {
  body: {
    refreshToken: string;
  };
}

interface IKeycloakRefreshTokenApiResponse {
  id_token: string;
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  session_state: string;
  scope: string;
  'not-before-policy': number;
}

async function keycloakRefreshToken(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    try {
      const keycloakUrlToRefreshToken = `${process.env.KEYCLOAK_BASE_URL}/protocol/openid-connect/token`;
      const keycloakParamsToRefreshToken = new URLSearchParams();
      const keycloakRefreshTokenBody = request.body as IKeycloakRefreshTokenParams['body'];

      keycloakParamsToRefreshToken.append(
        'client_id',
        process.env.KEYCLOAK_CLIENT_ID!
      );
      keycloakParamsToRefreshToken.append(
        'client_secret',
        process.env.KEYCLOAK_CLIENT_SECRET!
      );
      keycloakParamsToRefreshToken.append(
        'grant_type',
        ['refresh_token'].toString()
      );
      keycloakParamsToRefreshToken.append(
        'refresh_token',
        keycloakRefreshTokenBody.refreshToken
      );

      const keycloakRefreshTokenResponse = await axios.post(
        keycloakUrlToRefreshToken,
        keycloakParamsToRefreshToken
      );

      return response.json(keycloakRefreshTokenResponse.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        return response
          .status(error.response?.status || 401)
          .json(error.response?.data || {});
      }

      return response.status(401).send('');
    }
  } else {
    return response.status(405).json({
      message: 'Method not allowed, only POST method is available.'
    });
  }
}

export default keycloakRefreshToken;
export { type IKeycloakRefreshTokenApiResponse };
