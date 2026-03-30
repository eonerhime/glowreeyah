import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        if (
          credentials.email === process.env.CMS_ADMIN_EMAIL &&
          credentials.password === process.env.CMS_ADMIN_PASSWORD
        ) {
          return { id: '1', name: 'Admin', email: credentials.email };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/cms/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
