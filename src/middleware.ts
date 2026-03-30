import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/cms/login' },
});

export const config = {
  matcher: ['/cms/((?!login).*)'],
};
