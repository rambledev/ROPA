import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ข้าม static files และ API routes ทั้งหมด
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  })

  const isLoginPage = pathname.startsWith("/login")
  const isCioPage = pathname.startsWith("/cio")
  const role = token?.role as string | undefined

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (token && isLoginPage) {
    // หลัง login สำเร็จ ส่งไปหน้าตาม role
    return NextResponse.redirect(new URL(role === "cio" ? "/cio" : "/", req.nextUrl))
  }

  // บังคับ CIO ให้อยู่ในโซน /cio เท่านั้น (กันเข้าหน้า user ทั่วไปโดยไม่ตั้งใจ)
  if (role === "cio" && !isCioPage) {
    return NextResponse.redirect(new URL("/cio", req.nextUrl))
  }

  // กันไม่ให้ user ทั่วไป/admin เข้าโซน CIO
  if (role !== "cio" && isCioPage) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
