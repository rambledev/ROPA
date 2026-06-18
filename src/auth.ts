import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import axios from "axios"

const ADMIN_EMAILS = ["techo@rmu.ac.th"]
const ALLOWED_DOMAIN = "rmu.ac.th"
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email ?? ""
      if (!email.endsWith("@" + ALLOWED_DOMAIN)) return false
      return true
    },
    async jwt({ token, user, account }) {
      // ครั้งแรกที่ login
      if (account && user) {
        try {
          // เรียก backend เพื่อ sync user และรับ token
          const res = await axios.post(`${API_URL}/auth/google`, {
            email:     user.email,
            name:      user.name,
            image:     user.image,
            googleId:  account.providerAccountId,
            isAdmin:   ADMIN_EMAILS.includes(user.email ?? ""),
          })
          token.accessToken  = res.data.data.accessToken
          token.refreshToken = res.data.data.refreshToken
          token.role         = res.data.data.user.role
          token.backendId    = res.data.data.user.id
        } catch (err) {
          console.error("Backend sync error:", err)
          token.role = ADMIN_EMAILS.includes(user.email ?? "") ? "admin" : "user"
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user.role         = token.role as string
      session.user.accessToken  = token.accessToken as string
      session.user.backendId    = token.backendId as string
      return session
    },
  },
  pages: {
    signIn: "/login",
    error:  "/login",
  },
})
