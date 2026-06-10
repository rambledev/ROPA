"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await apiClient.post("/auth/login", { email, password })
      console.log("LOGIN RESPONSE:", JSON.stringify(res.data))
      const { accessToken, refreshToken, user } = res.data.data
      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)
      setError("LOGIN OK: role=" + user.role + " token=" + accessToken.substring(0, 30))
      // router.push disabled for debug
      // if (["admin", "cio"].includes(user.role)) {
      //   router.push("/admin")
      // } else {
      //   router.push("/")
      // }
    } catch (err: unknown) {
      const e = err as { response?: { status: number; data: unknown }; message?: string }
      console.error("LOGIN ERROR:", e)
      setError("ERROR " + (e.response?.status ?? "") + ": " + JSON.stringify(e.response?.data ?? e.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e0e0e0", padding: "2rem", width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ width: 56, height: 56, background: "#e8f5e9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>เข้าสู่ระบบ ROPA</h1>
          <p style={{ fontSize: 13, color: "#666" }}>สำหรับเจ้าหน้าที่มหาวิทยาลัยราชภัฏมหาสารคาม</p>
        </div>

        {error && (
          <div style={{ background: "#ffebee", border: "0.5px solid #e53935", borderRadius: 8, padding: "10px 14px", marginBottom: "1rem", fontSize: 13, color: "#e53935" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>อีเมล</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@rmu.ac.th" required
              style={{ width: "100%", padding: "9px 12px", border: "0.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>รหัสผ่าน</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
              style={{ width: "100%", padding: "9px 12px", border: "0.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "10px", background: loading ? "#81c784" : "#2e7d32", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a href="/" style={{ fontSize: 13, color: "#2e7d32", textDecoration: "none" }}>← กลับหน้าแบบฟอร์ม ROPA</a>
        </p>
      </div>
    </div>
  )
}
