import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/utils"
import { UserType } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase()
            }
          })

          if (!user) {
            throw new Error("Invalid email or password")
          }

          // Verify password
          const isPasswordValid = await verifyPassword(credentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error("Invalid email or password")
          }

          // Return user object (password excluded)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            userType: user.userType,
            location: user.location,
            verified: user.verified
          }
        } catch (error) {
          console.error("Authentication error:", error)
          throw new Error("Authentication failed")
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Include user info in JWT token
      if (user) {
        token.userId = user.id
        token.userType = user.userType
        token.location = user.location
        token.verified = user.verified
      }
      return token
    },
    async session({ session, token }) {
      // Include user info in session
      if (token && session.user) {
        session.user.id = token.userId as string
        session.user.userType = token.userType as UserType
        session.user.location = token.location as string
        session.user.verified = token.verified as boolean
      }
      return session
    }
  },
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
}