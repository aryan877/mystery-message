export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    // '/((?!.*\\..*|_next).*)', // Apply middleware to all paths excluding static files and _next directory
  ],
};
