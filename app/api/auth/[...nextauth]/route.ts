import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        try {
          const admin = await prisma.admin.findUnique({
            where: { email: credentials.email }
          })

          if (!admin) return null
          
          if (admin.password === credentials.password) {
            return { id: admin.id, email: admin.email, name: "Admin" }
          }
        } catch {
          // If DB is not connected yet, allow a dummy bypass for development only if strict testing
          if (process.env.NODE_ENV !== 'production' && credentials.email === "admin@dnnepal.com" && credentials.password === "password") {
             return { id: "1", email: "admin@dnnepal.com", name: "Admin (Fallback)" }
          }
        }

        return null
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt"
  }
})

export { handler as GET, handler as POST }
