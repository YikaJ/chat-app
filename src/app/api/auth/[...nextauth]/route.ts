import { prisma } from '@/lib/prisma'
import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  // your configs
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 2 * 24 * 60 * 60
  },
  pages: {
    signIn: '/login',
    signOut: '/'
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials, req) {
        console.log({ credentials })
        if (!credentials?.email) return null
        // Add logic here to look up the user from the credentials supplied
        const user = await prisma.user.findUnique({
          where: ({ email: credentials.email })
        })

        if (user) {
          return user
        } else {
          return null
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ user, token }) {
      if (user) {
        token.user_id = user.id
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  }
}

// App Route 的使用方式
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }