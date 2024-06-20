import NextAuth from 'next-auth'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { cookies } from 'next/headers'

const nextAuthOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'password', type: 'password' }
      },

      async authorize(credentials) {
        if (!credentials) {
          return null
        }

        try {
          const response = await fetch(
            'http://localhost:4000/api/v1/sessions/',
            {
              method: 'POST',
              headers: {
                'Content-type': 'application/json'
              },
              body: JSON.stringify({
                username: credentials.username,
                password: credentials.password
              })
            }
          )

          if (response.status !== 200) {
            return null
          }

          const authData = await response.json()

          if (!authData.token) return null

          cookies().set('jwt', authData.token)

          return {
            id: authData.user.id,
            name: authData.user.username,
            role: authData.user.role,
            avatar: authData.user.avatar,
            token: authData.token
          }
        } catch (error) {
          return null
        }
      }
    })
  ],
  callbacks: {
    async session({ token, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          avatar: token.avatar,
          token: token.token
        }
      }
    },
    async jwt({ token, user }) {
      const merged = { ...token, ...user }

      return {
        id: merged.id,
        name: merged.name,
        role: merged.role,
        avatar: merged.avatar,
        token: merged.token
      }
    }
  }
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST, nextAuthOptions }
