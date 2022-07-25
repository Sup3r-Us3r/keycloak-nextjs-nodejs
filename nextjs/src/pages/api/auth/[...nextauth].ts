import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import axios from 'axios';
import type { JWT } from 'next-auth/jwt';

import type { IKeycloakRefreshTokenApiResponse } from './keycloakRefreshToken';

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT) {
  try {
    const refreshedTokens = await axios.post<IKeycloakRefreshTokenApiResponse>(
      'http://localhost:3000/api/auth/keycloakRefreshToken',
      {
        refreshToken: token?.refreshToken
      }
    );

    if (refreshedTokens.status !== 200) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.data.access_token,
      accessTokenExpired: Date.now() + refreshedTokens.data.expires_in * 1000,
      refreshToken: refreshedTokens.data.refresh_token ?? token.refreshToken,
      refreshTokenExpired: Date.now() + refreshedTokens.data.refresh_expires_in * 1000
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
};

export default NextAuth({
  providers: [
    KeycloakProvider({
      id: 'keycloak',
      name: 'Keycloak',
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: 'http://localhost:8080/auth/realms/apps',
      requestTokenUrl: `${process.env.KEYCLOAK_BASE_URL}/protocol/openid-connect/auth`,
      authorization: {
        params: {
          scope: 'openid email profile',
        }
      },
      checks: ['pkce', 'state'],
      idToken: true,
      profile(profile) {
        return {
          id: profile.sub,
          ...profile
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt'
  },
  // Generate secret: openssl rand -base64 32
  secret: 'F9BNdSJqoV0j+YuEq0erYXp+/eY7rAVU9+U+AFHzy3w=',
  pages: {
    signIn: undefined
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return Promise.resolve(url.startsWith(baseUrl) ? url : baseUrl);
    },
    async signIn({ account, user }) {
      if (account && user) {
        return true;
      } else {
        return false;
      }
    },
    jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // Add access_token, refresh_token and expirations to the token right after signin
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpired = account.expires_at! * 1000;
        token.refreshTokenExpired = Date.now() + account.refresh_expires_in! * 1000;
        token.user = user;

        return token;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpired) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.error = token.error;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }

      return session;
    }
  }
});
