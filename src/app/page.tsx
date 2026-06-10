"use client"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/client"
import RopaForm from "@/components/ropa/RopaForm"

type RopaItem = {
  id: string
  ropaId: string
  title: string
  status: string
  version: number
  updatedAt: string
  sections: { sectionNumber: number }[]
}

const STATUS: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  draft:     { label: "ร่าง",       color: "#666",    bg: "#f5f5f5", icon: "ti-file-pencil" },
  submitted: { label: "รออนุมัติ", color: "#1565c0", bg: "#e3f2fd", icon: "ti-file-time"   },
  approved:  { label: "อนุมัติ",   color: "#2e7d32", bg: "#e8f5e9", icon: "ti-file-check"  },
  rejected:  { label: "ปฏิเสธ",   color: "#e53935", bg: "#ffebee", icon: "ti-file-x"      },
}

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState<"list" | "form">("list")
  const [items, setItems] = useState<RopaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchMyRopa()
    }
  }, [status])

  const fetchMyRopa = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get("/ropa")
      setItems(res.data.data ?? [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const onSubmitSuccess = () => {
    setTab("list")
    fetchMyRopa()
  }

  if (status === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#666" }}>กำลังโหลด...</div>
  )
  if (!session) return null

  const stats = {
    total:     items.length,
    submitted: items.filter(i => i.status === "submitted").length,
    approved:  items.filter(i => i.status === "approved").length,
    draft:     items.filter(i => i.status === "draft").length,
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>

      {/* Header */}
      <header style={{ background: "#2e7d32", color: "#fff", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🎓</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 500 }}>ระบบ ROPA — มหาวิทยาลัยราชภัฏมหาสารคาม</div>
          <div style={{ fontSize: 11, opacity: .75 }}>บันทึกกิจกรรมการประมวลผลข้อมูลส่วนบุคคล (PDPA)</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {session.user?.image && <img src={session.user.image} style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)" }} alt="" />}
          <span style={{ fontSize: 13, opacity: .9 }}>{session.user?.name}</span>
          <button onClick={() => signOut({ callbackUrl: "/login?prompt=select_account" })}
            style={{ background: "#e53935", color: "#fff", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
            ออกจากระบบ
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e0e0e0", display: "flex", padding: "0 20px" }}>
        <button onClick={() => setTab("list")}
          style={{ padding: "12px 20px", fontSize: 14, fontWeight: tab === "list" ? 500 : 400, color: tab === "list" ? "#2e7d32" : "#666", background: "none", border: "none", borderBottom: tab === "list" ? "2px solid #2e7d32" : "2px solid transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>
          <i className="ti ti-list" style={{ fontSize: 16 }} aria-hidden="true"></i>
          รายการลงทะเบียน {items.length > 0 && <span style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: 11, padding: "1px 7px", borderRadius: 20 }}>{items.length}</span>}
        </button>
        <button onClick={() => setTab("form")}
          style={{ padding: "12px 20px", fontSize: 14, fontWeight: tab === "form" ? 500 : 400, color: tab === "form" ? "#2e7d32" : "#666", background: "none", border: "none", borderBottom: tab === "form" ? "2px solid #2e7d32" : "2px solid transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>
          <i className="ti ti-file-plus" style={{ fontSize: 16 }} aria-hidden="true"></i>
          ลงทะเบียนใหม่
        </button>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* Tab 1: รายการ */}
        {tab === "list" && (
          <div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1.25rem" }}>
              {[
                { label: "รายการทั้งหมด", value: stats.total,     color: "#1a1a1a" },
                { label: "รออนุมัติ",    value: stats.submitted, color: "#1565c0" },
                { label: "อนุมัติแล้ว",  value: stats.approved,  color: "#2e7d32" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 500, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {loading ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#999", fontSize: 14 }}>กำลังโหลด...</div>
              ) : items.length === 0 ? (
                <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "3rem", textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                  <div style={{ fontSize: 15, color: "#444", marginBottom: 6 }}>ยังไม่มีรายการลงทะเบียน</div>
                  <div style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>กดปุ่มด้านล่างเพื่อลงทะเบียน ROPA รายการแรก</div>
                  <button onClick={() => setTab("form")}
                    style={{ background: "#2e7d32", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                    + ลงทะเบียนรายการใหม่
                  </button>
                </div>
              ) : items.map(item => {
                const s = STATUS[item.status] ?? STATUS.draft
                return (
                  <div key={item.id} onClick={() => router.push(`/ropa/${item.id}`)}
                    style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                    <div style={{ width: 42, height: 42, background: s.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <i className={`ti ${s.icon}`} style={{ fontSize: 20, color: s.color }} aria-hidden="true"></i>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: "#999" }}>{item.ropaId || "ยังไม่มีรหัส"} · อัปเดต {new Date(item.updatedAt).toLocaleDateString("th-TH")}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>{s.label}</span>
                      <span style={{ fontSize: 12, color: "#999" }}>{item.sections.length}/13</span>
                      <i className="ti ti-chevron-right" style={{ fontSize: 16, color: "#ccc" }} aria-hidden="true"></i>
                    </div>
                  </div>
                )
              })}
            </div>

            {items.length > 0 && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button onClick={() => setTab("form")}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#2e7d32", fontSize: 13, cursor: "pointer", padding: "8px 16px", border: "0.5px solid #a5d6a7", borderRadius: 8, background: "#fff", fontFamily: "inherit" }}>
                  <i className="ti ti-plus" style={{ fontSize: 16 }} aria-hidden="true"></i>
                  ลงทะเบียนรายการใหม่
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: ฟอร์ม */}
        {tab === "form" && (
          <RopaForm onSuccess={onSubmitSuccess} />
        )}
      </div>
    </div>
  )
}
