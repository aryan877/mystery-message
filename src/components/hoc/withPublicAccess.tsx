'use client';

import React, { ComponentType, useEffect } from 'react';
import { useSession, SessionProviderProps } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const withPublicAccess = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  const WithPublicAccess: ComponentType<P & SessionProviderProps> = (props) => {
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
      // Redirect to the dashboard if the user is already authenticated
      if (status === 'authenticated') {
        router.replace('/dashboard');
      }
    }, [status, router]);

    // Render the component only if the user is not authenticated
    return status !== 'authenticated' ? <WrappedComponent {...props} /> : null;
  };

  return WithPublicAccess;
};

export default withPublicAccess;
