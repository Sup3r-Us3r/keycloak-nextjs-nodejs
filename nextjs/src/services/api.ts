import axios, { AxiosError, AxiosInstance } from 'axios';
import type { SessionContextValue as KeycloakSession } from 'next-auth/react';

import type { IKeycloakRefreshTokenApiResponse } from '../pages/api/auth/keycloakRefreshToken';

type FailedRequestsQueue = {
  onSuccess: (newToken: string) => void;
  onFailure: (failureError: AxiosError) => void;
};

let isRefreshingToken: boolean = false;
let failedRequestsQueue: FailedRequestsQueue[] = [];
let requestsAttempts = 0;
const maximumRequestsAttempts = 3;

function setupAPIClient(keycloakSession: KeycloakSession['data']): AxiosInstance {
  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${keycloakSession?.accessToken}`
    }
  });

  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if (error.response?.status === 401 && (requestsAttempts < maximumRequestsAttempts)) {
      if ((error.response?.data as { errorCode: string })?.errorCode === 'token.invalid') {
        const axiosOriginalErrorConfig = error.config;

        if (!isRefreshingToken) {
          isRefreshingToken = true;

          axios.post<IKeycloakRefreshTokenApiResponse>(
            '/api/auth/keycloakRefreshToken',
            {
              refreshToken: keycloakSession?.refreshToken
            }
          )
            .then(refreshTokenResponse => {
              api.defaults.headers.common['Authorization'] = `Bearer ${refreshTokenResponse.data.access_token}`;

              failedRequestsQueue.forEach(request =>
                request.onSuccess(refreshTokenResponse.data.access_token)
              );
              failedRequestsQueue = [];
            })
            .catch((error: AxiosError) => {
              failedRequestsQueue.forEach(request => request.onFailure(error));
              failedRequestsQueue = [];
            })
            .finally(() => {
              isRefreshingToken = false;
              requestsAttempts++;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (newToken: string) => {
              axiosOriginalErrorConfig.headers!['Authorization'] = `Bearer ${newToken}`;

              resolve(api(axiosOriginalErrorConfig));
            },
            onFailure: (failureError: AxiosError) => {
              reject(failureError);
            }
          });
        });
      } else {
        return Promise.reject(error);
      }
    }

    if (requestsAttempts >= maximumRequestsAttempts) {
      requestsAttempts = 0;
    }

    return Promise.reject(error);
  });

  return api;
}

export { setupAPIClient };
