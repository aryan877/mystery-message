import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession['user'];
  }
    interface User {
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    }
}


declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}