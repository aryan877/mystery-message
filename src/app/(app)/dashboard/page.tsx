'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';

function UserDashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading user information...</div>;
  }

  if (!session || !session.user) {
    return <div>User not found. Please log in.</div>;
  }

  const { username, isAcceptingMessages } = session.user as User;

  return (
    <>
      <h1>Welcome, {username}!</h1>
      <p>
        User can see all of the messages sent to them here with authentication.
      </p>
      <p>Users can manage their message sending settings here.</p>
      <p>{Boolean(isAcceptingMessages)}</p>
      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white font-bold px-6 py-2 mt-3"
      >
        Sign Out
      </button>
    </>
  );
}

export default UserDashboard;
