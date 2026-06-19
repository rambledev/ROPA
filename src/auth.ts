import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

const ADMIN_EMAILS = ["techo@rmu.ac.th"]
const CIO_EMAILS = ["weerapon.pa@rmu.ac.th", "cc.claude3@rmu.ac.th"]
const ALLOWED_DOMAIN = "rmu.ac.th"

export const { handlers, auth, signIn, signOut } = NextAuth({
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
      const email = (user.email ?? "").toLowerCase()
      if (!email.endsWith("@" + ALLOWED_DOMAIN)) return false
      return true
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        const email = (user.email ?? "").toLowerCase()
        token.role = CIO_EMAILS.includes(email)
          ? "cio"
          : ADMIN_EMAILS.includes(email)
            ? "admin"
            : "user"
        token.email = user.email
        token.name = user.name
        token.image = user.image
        token.googleId = account.providerAccountId
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
