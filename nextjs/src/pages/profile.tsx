import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';

import { Layout } from '../components/Layout';

const ProfilePage: NextPage = () => {
  const session = useSession();

  const userData = session.data?.user;

  const profile = session.status === 'authenticated' ? (
    <div>
      <p>
        <span className="font-weight-bold mr-1">Email:</span>
        <span className="text-muted">{userData?.email ?? ''}</span>
      </p>
      <p>
        <span className="font-weight-bold mr-1">Username:</span>
        <span className="text-muted">
          {userData?.preferred_username ?? ''}
        </span>
      </p>
      <p>
        <span className="font-weight-bold mr-1">First Name:</span>
        <span className="text-muted">{userData?.given_name ?? ''}</span>
      </p>
      <p>
        <span className="font-weight-bold mr-1">Last Name:</span>
        <span className="text-muted">{userData?.family_name ?? ''}</span>
      </p>
      <p>
        <span className="font-weight-bold mr-1 text-nowrap">Access token:</span>
        <span className="text-muted text-break">{session.data.accessToken}</span>
      </p>

      <p>
        <span className="font-weight-bold mr-1 text-nowrap">Refresh token:</span>
        <span className="text-muted text-break">{session.data.refreshToken}</span>
      </p>
    </div>
  ) : (
    <span>Please login to view profile.</span>
  )

  return (
    <Layout title="Profile | Next.js + Keycloak Example">
      <h1 className="my-5">User Profile</h1>
      {profile}
    </Layout>
  )
}

export default ProfilePage;
