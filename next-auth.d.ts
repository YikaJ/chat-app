import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt';

// nextauth.d.ts
declare module "next-auth" {
  interface User {
    id: string
  }

  interface Session extends DefaultSession {
    user?: User;
  }

  interface JWT extends DefaultJWT {
    userID: string
  }
}