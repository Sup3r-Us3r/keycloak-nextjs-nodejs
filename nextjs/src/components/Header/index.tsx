import Link from 'next/link';
import Router from 'next/router';
import { signIn, signOut } from 'next-auth/react';

const Header = () => {
  return (
    <header className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
      <Link href="/">
        <a className="my-0 mr-md-auto font-weight-bold text-dark">
          Next.js + Keycloak
        </a>
      </Link>

      <button
        type="button"
        className="mx-2 btn btn-outline-primary"
        onClick={() => {
          Router.push('/profile');
        }}
      >
        Profile
      </button>

      <button
        type="button"
        className="mx-2 btn btn-outline-success"
        onClick={() => signIn('keycloak')}
      >
        Login
      </button>

      <button
        type="button"
        className="mx-2 btn btn-outline-danger"
        onClick={() => signOut()}
      >
        Logout
      </button>
    </header>
  )
}

export { Header };
