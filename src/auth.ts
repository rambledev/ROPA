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
      console.log("=== SIGNIN CALLBACK TRIGGERED ===")
      const email = user.email ?? ""
      console.log("[AUTH] email:", email)
      if (!email.endsWith("@" + ALLOWED_DOMAIN)) {
        console.log("[AUTH] REJECTED")
        return false
      }
      console.log("[AUTH] ACCEPTED")
      return true
    },
    async jwt({ token, user, account }) {
      console.log("=== JWT CALLBACK TRIGGERED ===")
      if (account && user) {
        token.role = ADMIN_EMAILS.includes(user.email ?? "") ? "admin" : "user"
        token.email = user.email
        token.name = user.name
        token.image = user.image
        token.googleId = account.providerAccountId
      }
      return token
    },
    async session({ session, token }) {
      console.log("=== SESSION CALLBACK TRIGGERED ===")
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
