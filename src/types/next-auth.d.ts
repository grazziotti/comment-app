// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { User } from 'next-auth'

type UserId = string

declare module 'next-auth' {
  interface User {
    role: string
    token: string
    avatar: string | null
  }

  interface Session {
    user: {
      role: string
      token: string
      avatar: string | null
    } & DefaultSession['user']
  }

  interface JWT extends DefaultJWT {
    role: string
    token: string
    avatar: string | null
  }
}
