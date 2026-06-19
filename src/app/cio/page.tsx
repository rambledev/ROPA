"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cioApi } from "@/lib/api/cio"
import { RISK_LABELS, RISK_COLORS } from "@/lib/ropaLabels"

type DashboardStats = {
  total: number
  statusCounts: Record<string, number>
  byDepartment: { departmentId: string; departmentName: string | null; count: number }[]
  riskCounts: Record<string, number>
  dpiaRequired: number
  monthlyTrend: { month: string; count: number }[]
}

const STATUS_CARDS = [
  { key: "submitted", label: "รออนุมัติ", color: "#1565c0", bg: "#e3f2fd", icon: "⏳" },
  { key: "approved",  label: "อนุมัติแล้ว", color: "#2e7d32", bg: "#e8f5e9", icon: "✅" },
  { key: "revision",  label: "ต้องแก้ไข", color: "#e65100", bg: "#fff3e0", icon: "✏️" },
  { key: "draft",     label: "ร่าง", color: "#666", bg: "#f5f5f5", icon: "📝" },
]

export default function CioDashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      cioApi.getDashboard()
        .then(setStats)
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [status])

  if (loading || status === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#666" }}>กำลังโหลด...</div>
  )
  if (!stats) return null

  const maxDeptCount = Math.max(...stats.byDepartment.map(d => d.count), 1)
  const maxTrend = Math.max(...stats.monthlyTrend.map(m => m.count), 1)

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* Header */}
      <header style={{ background: "#1a237e", color: "#fff", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600 }}>CIO Dashboard</div>
          <div style={{ fontSize: 12, opacity: .75 }}>ระบบ ROPA — มหาวิทยาลัยราชภัฏมหาสารคาม</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <nav style={{ display: "flex", gap: 8 }}>
            <button onClick={() => router.push("/cio")} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Dashboard</button>
            <button onClick={() => router.push("/cio/approvals")} style={{ background: "transparent", border: "none", color: "#fff", borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", opacity: .85 }}>รายการอนุมัติ</button>
          </nav>
          <span style={{ fontSize: 13 }}>{session?.user?.name}</span>
          <button onClick={() => signOut({ callbackUrl: "/login" })} style={{ background: "#c62828", border: "none", color: "#fff", borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>ออกจากระบบ</button>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* Total + status cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
          <div style={{ background: "#1a237e", color: "#fff", borderRadius: 12, padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, opacity: .85 }}>ROPA ทั้งหมด</div>
            <div style={{ fontSize: 36, fontWeight: 700, marginTop: 8 }}>{stats.total}</div>
            <div style={{ fontSize: 12, opacity: .7 }}>รายการ</div>
          </div>
          {STATUS_CARDS.map(c => (
            <button key={c.key} onClick={() => router.push(`/cio/approvals?status=${c.key}`)}
              style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", border: "0.5px solid #e0e0e0", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
              <div style={{ fontSize: 13, color: "#666", display: "flex", alignItems: "center", gap: 6 }}>{c.icon} {c.label}</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: c.color, marginTop: 8 }}>{stats.statusCounts[c.key] ?? 0}</div>
              <div style={{ fontSize: 12, color: "#999" }}>คลิกเพื่อดูรายการ →</div>
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.5rem" }}>

          {/* Risk level breakdown */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", border: "0.5px solid #e0e0e0" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>ระดับความเสี่ยง</div>
            {(["low","medium","high","very_high","unassessed"] as const).map(level => {
              const count = stats.riskCounts[level] ?? 0
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0
              const label = level === "unassessed" ? "ยังไม่ประเมิน" : RISK_LABELS[level]
              const color = level === "unassessed" ? "#999" : RISK_COLORS[level]
              return (
                <div key={level} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "#555" }}>{label}</span>
                    <span style={{ fontWeight: 600, color }}>{count}</span>
                  </div>
                  <div style={{ height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4 }} />
                  </div>
                </div>
              )
            })}
            <div style={{ marginTop: 14, padding: "10px 12px", background: "#fff3e0", borderRadius: 8, fontSize: 13, color: "#e65100" }}>
              ⚠️ ต้องทำ DPIA: <strong>{stats.dpiaRequired}</strong> รายการ
            </div>
          </div>

          {/* Top departments */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", border: "0.5px solid #e0e0e0" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>หน่วยงานที่มี ROPA มากที่สุด (Top 10)</div>
            {stats.byDepartment.length === 0 ? (
              <div style={{ color: "#999", fontSize: 13 }}>ยังไม่มีข้อมูล</div>
            ) : stats.byDepartment.map(d => (
              <div key={d.departmentId} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>{d.departmentName ?? "ไม่ระบุ"}</span>
                  <span style={{ fontWeight: 600, color: "#1a237e" }}>{d.count}</span>
                </div>
                <div style={{ height: 7, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(d.count / maxDeptCount) * 100}%`, background: "#1a237e", borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly trend */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", border: "0.5px solid #e0e0e0" }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>แนวโน้มการลงทะเบียน (6 เดือนล่าสุด)</div>
          {stats.monthlyTrend.length === 0 ? (
            <div style={{ color: "#999", fontSize: 13 }}>ยังไม่มีข้อมูล</div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140, paddingTop: 10 }}>
              {stats.monthlyTrend.map(m => (
                <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1a237e" }}>{m.count}</div>
                  <div style={{ width: "100%", maxWidth: 36, height: `${(m.count / maxTrend) * 90 + 10}px`, background: "#1a237e", borderRadius: "4px 4px 0 0" }} />
                  <div style={{ fontSize: 11, color: "#999" }}>{m.month}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
