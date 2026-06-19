"use client"
import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cioApi } from "@/lib/api/cio"
import { STATUS } from "@/lib/ropaLabels"

type RopaListItem = {
  id: string; ropaId: string; title: string; status: string
  createdAt: string; submittedAt: string | null
  department: { name: string } | null
  owner: { firstName: string; lastName: string; email: string } | null
}

const STATUS_FILTERS = [
  { key: "", label: "ทั้งหมด" },
  { key: "submitted", label: "รออนุมัติ" },
  { key: "approved", label: "อนุมัติแล้ว" },
  { key: "revision", label: "ต้องแก้ไข" },
  { key: "draft", label: "ร่าง" },
]

function ApprovalsContent() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const [items, setItems] = useState<RopaListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(searchParams.get("status") ?? "")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  const load = async (statusFilter: string) => {
    setLoading(true)
    try {
      const data = statusFilter ? await cioApi.getAll(statusFilter) : await cioApi.getAll()
      setItems(data)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") load(filter)
  }, [status, filter])

  const quickReview = async (id: string, decision: "approved" | "rejected") => {
    const label = decision === "approved" ? "อนุมัติ" : "ไม่อนุมัติ (ส่งกลับแก้ไข)"
    if (!confirm(`ยืนยันการ${label} รายการนี้?`)) return
    try {
      await cioApi.review(id, decision)
      load(filter)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      alert(e.response?.data?.message ?? "เกิดข้อผิดพลาด")
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <header style={{ background: "#1a237e", color: "#fff", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600 }}>รายการขออนุมัติ ROPA</div>
          <div style={{ fontSize: 12, opacity: .75 }}>มหาวิทยาลัยราชภัฏมหาสารคาม</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <nav style={{ display: "flex", gap: 8 }}>
            <button onClick={() => router.push("/cio")} style={{ background: "transparent", border: "none", color: "#fff", borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", opacity: .85 }}>Dashboard</button>
            <button onClick={() => router.push("/cio/approvals")} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>รายการอนุมัติ</button>
          </nav>
          <span style={{ fontSize: 13 }}>{session?.user?.name}</span>
          <button onClick={() => signOut({ callbackUrl: "/login" })} style={{ background: "#c62828", border: "none", color: "#fff", borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>ออกจากระบบ</button>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
          {STATUS_FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                border: filter === f.key ? "none" : "0.5px solid #ccc",
                background: filter === f.key ? "#1a237e" : "#fff",
                color: filter === f.key ? "#fff" : "#555",
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#999", fontSize: 14 }}>กำลังโหลด...</div>
          ) : items.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#999", fontSize: 14 }}>ไม่มีรายการ</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "0.5px solid #e0e0e0" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left", color: "#666", fontWeight: 500 }}>รหัส ROPA</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", color: "#666", fontWeight: 500 }}>ชื่อกิจกรรม</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", color: "#666", fontWeight: 500 }}>หน่วยงาน</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", color: "#666", fontWeight: 500 }}>ผู้ส่ง</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", color: "#666", fontWeight: 500 }}>สถานะ</th>
                  <th style={{ padding: "10px 14px", textAlign: "left", color: "#666", fontWeight: 500 }}>วันที่ส่ง</th>
                  <th style={{ padding: "10px 14px", textAlign: "center", color: "#666", fontWeight: 500 }}>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const s = STATUS[item.status] ?? STATUS.draft
                  return (
                    <tr key={item.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", borderBottom: "0.5px solid #f0f0f0" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: "#2e7d32" }}>{item.ropaId}</td>
                      <td style={{ padding: "10px 14px", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</td>
                      <td style={{ padding: "10px 14px", color: "#555" }}>{item.department?.name ?? "-"}</td>
                      <td style={{ padding: "10px 14px", color: "#555" }}>{item.owner ? `${item.owner.firstName} ${item.owner.lastName}` : "-"}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>{s.label}</span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "#999" }}>
                        {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString("th-TH") : "-"}
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button onClick={() => router.push(`/cio/approvals/${item.id}`)}
                            style={{ background: "#1565c0", border: "none", color: "#fff", borderRadius: 5, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                            ดูรายละเอียด
                          </button>
                          {item.status === "submitted" && (
                            <>
                              <button onClick={() => quickReview(item.id, "approved")}
                                style={{ background: "#2e7d32", border: "none", color: "#fff", borderRadius: 5, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                                ✓ อนุมัติ
                              </button>
                              <button onClick={() => quickReview(item.id, "rejected")}
                                style={{ background: "#c62828", border: "none", color: "#fff", borderRadius: 5, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                                ✗ ไม่อนุมัติ
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CioApprovalsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#666" }}>กำลังโหลด...</div>}>
      <ApprovalsContent />
    </Suspense>
  )
}
