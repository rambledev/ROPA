"use client"
import { useEffect, useState } from "react"
import { adminApi } from "@/lib/api/admin"
import Link from "next/link"

type Stats = {
  total: number; draft: number; submitted: number
  approved: number; rejected: number
  totalUsers: number; totalDepts: number
  byDept: { deptName: string; deptCode: string; total: number }[]
}

const StatCard = ({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) => (
  <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "1.25rem 1.5rem", flex: 1, minWidth: 140 }}>
    <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
    <div style={{ height: 3, background: bg, borderRadius: 2, marginTop: 10 }} />
  </div>
)

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getDashboard().then(setStats).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign: "center", padding: "3rem", color: "#666", fontSize: 14 }}>กำลังโหลด...</div>
  if (!stats) return <div style={{ textAlign: "center", padding: "3rem", color: "#e53935", fontSize: 14 }}>โหลดข้อมูลไม่สำเร็จ</div>

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a" }}>Dashboard ภาพรวม</h1>
        <p style={{ fontSize: 13, color: "#666", marginTop: 2 }}>สถิติระบบ ROPA มหาวิทยาลัยราชภัฏมหาสารคาม</p>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <StatCard label="ROPA ทั้งหมด"   value={stats.total}      color="#1a1a1a" bg="#e0e0e0" />
        <StatCard label="ร่าง"           value={stats.draft}      color="#666"    bg="#f5f5f5" />
        <StatCard label="รออนุมัติ"      value={stats.submitted}  color="#1565c0" bg="#e3f2fd" />
        <StatCard label="อนุมัติแล้ว"   value={stats.approved}   color="#2e7d32" bg="#e8f5e9" />
        <StatCard label="ปฏิเสธ"        value={stats.rejected}   color="#e53935" bg="#ffebee" />
        <StatCard label="ผู้ใช้งาน"     value={stats.totalUsers} color="#6a1b9a" bg="#f3e5f5" />
      </div>

      {/* By department */}
      <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: "#1a1a1a", marginBottom: "1rem", display: "flex", justifyContent: "space-between" }}>
          <span>ROPA แยกตามหน่วยงาน</span>
          <Link href="/admin/ropa" style={{ fontSize: 13, color: "#2e7d32", textDecoration: "none" }}>ดูทั้งหมด →</Link>
        </div>
        {stats.byDept.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#999", fontSize: 14 }}>ยังไม่มีข้อมูล</div>
        ) : (
          <div>
            {stats.byDept.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "0.5px solid #f0f0f0" }}>
                <div style={{ width: 32, height: 32, background: "#e8f5e9", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#2e7d32", flexShrink: 0 }}>
                  {d.deptCode?.slice(0, 2) ?? "—"}
                </div>
                <div style={{ flex: 1, fontSize: 14, color: "#1a1a1a" }}>{d.deptName ?? "ไม่ระบุ"}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#2e7d32" }}>{d.total} รายการ</div>
                <div style={{ width: 100, height: 6, background: "#f0f0f0", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "#2e7d32", borderRadius: 3, width: `${Math.min((d.total / (stats.total || 1)) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "1.25rem 1.5rem" }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: "#1a1a1a", marginBottom: "1rem" }}>Quick Actions</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/admin/ropa" style={{ background: "#2e7d32", color: "#fff", padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontSize: 14 }}>
            📋 ดูรายการ ROPA ทั้งหมด
          </Link>
          <Link href="/admin/ropa?status=submitted" style={{ background: "#1565c0", color: "#fff", padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontSize: 14 }}>
            ⏳ รออนุมัติ ({stats.submitted})
          </Link>
        </div>
      </div>
    </div>
  )
}
