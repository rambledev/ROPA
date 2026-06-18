import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

const ADMIN_EMAILS = ["techo@rmu.ac.th"]
const ALLOWED_DOMAIN = "rmu.ac.th"

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { prompt: "select_account" },
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
      if (account && user) {
        token.role = ADMIN_EMAILS.includes(user.email ?? "") ? "admin" : "user"
        token.email = user.email
        token.name = user.name
        token.image = user.image
        token.googleId = account.providerAccountId
        token.needsSync = true
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role as string
      session.user.email = token.email as string
      session.user.name = token.name as string
      session.user.image = token.image as string
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
})
