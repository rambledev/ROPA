"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ role: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) { router.push("/login"); return }
    try {
      const payload = JSON.parse(atob(token.split(".")[1] ?? ""))
      if (!["admin", "cio"].includes(payload.role)) {
        router.push("/")
        return
      }
      setUser({ role: payload.role })
    } catch {
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/login")
  }

  const navItems = [
    { href: "/admin",      label: "Dashboard",    icon: "📊" },
    { href: "/admin/ropa", label: "รายการ ROPA",  icon: "📋" },
  ]

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
      <div style={{ fontSize: 14, color: "#666" }}>กำลังโหลด...</div>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <nav style={{ background: "#2e7d32", color: "#fff", padding: "0 1.5rem", display: "flex", alignItems: "center", height: 56, gap: 0 }}>
        <span style={{ fontWeight: 600, fontSize: 15, marginRight: 24 }}>ระบบ ROPA — มรม.</span>
        {navItems.map(item => (
          <Link key={item.href} href={item.href}
            style={{ color: pathname === item.href ? "#fff" : "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14, padding: "0 16px", height: 56, display: "flex", alignItems: "center", borderBottom: pathname === item.href ? "3px solid #fff" : "3px solid transparent" }}>
            {item.icon} {item.label}
          </Link>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: 20 }}>
            {user?.role?.toUpperCase()}
          </span>
          <button onClick={handleLogout}
            style={{ background: "#e53935", color: "#fff", border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 13, cursor: "pointer" }}>
            ออกจากระบบ
          </button>
        </div>
      </nav>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1rem" }}>
        {children}
      </main>
    </div>
  )
}
