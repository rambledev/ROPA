"use client"
import { useEffect, useState } from "react"
import { adminApi } from "@/lib/api/admin"
import Link from "next/link"

type RopaItem = {
  id: string; ropaId: string; title: string; status: string; version: number
  createdAt: string; updatedAt: string
  owner: { firstName: string; lastName: string; email: string }
  department: { name: string; code: string }
  sections: { sectionNumber: number }[]
}

const STATUS = {
  draft:     { label: "ร่าง",       color: "#666",    bg: "#f5f5f5" },
  submitted: { label: "รออนุมัติ", color: "#1565c0", bg: "#e3f2fd" },
  approved:  { label: "อนุมัติ",   color: "#2e7d32", bg: "#e8f5e9" },
  rejected:  { label: "ปฏิเสธ",   color: "#e53935", bg: "#ffebee" },
  revision:  { label: "แก้ไข",    color: "#e65100", bg: "#fff3e0" },
} as Record<string, { label: string; color: string; bg: string }>

export default function AdminRopaList() {
  const [items, setItems] = useState<RopaItem[]>([])
  const [filtered, setFiltered] = useState<RopaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    adminApi.getAllRopa().then(data => {
      setItems(data)
      setFiltered(data)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = items
    if (statusFilter !== "all") result = result.filter(i => i.status === statusFilter)
    if (search) result = result.filter(i =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.ropaId.toLowerCase().includes(search.toLowerCase()) ||
      i.department?.name?.toLowerCase().includes(search.toLowerCase()) ||
      `${i.owner?.firstName} ${i.owner?.lastName}`.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [search, statusFilter, items])

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a" }}>รายการ ROPA ทั้งหมด</h1>
          <p style={{ fontSize: 13, color: "#666", marginTop: 2 }}>พบ {filtered.length} รายการ</p>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "1rem 1.25rem", marginBottom: "1rem", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ค้นหา ROPA ID, ชื่อกิจกรรม, หน่วยงาน, ผู้รับผิดชอบ..."
          style={{ flex: 1, minWidth: 250, padding: "8px 12px", border: "0.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" }}
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: "8px 12px", border: "0.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit", background: "#fff" }}>
          <option value="all">ทุกสถานะ</option>
          <option value="draft">ร่าง</option>
          <option value="submitted">รออนุมัติ</option>
          <option value="approved">อนุมัติแล้ว</option>
          <option value="rejected">ปฏิเสธ</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#999", fontSize: 14 }}>กำลังโหลด...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#999", fontSize: 14 }}>ไม่พบรายการ</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "0.5px solid #e0e0e0" }}>
                {["รหัส ROPA", "ชื่อกิจกรรม", "หน่วยงาน", "ผู้รับผิดชอบ", "ส่วนที่กรอก", "สถานะ", "วันที่", ""].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, color: "#666", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const s = STATUS[item.status] ?? STATUS.draft
                return (
                  <tr key={item.id} style={{ borderBottom: "0.5px solid #f0f0f0" }}>
                    <td style={{ padding: "12px 16px", color: "#2e7d32", fontWeight: 500, whiteSpace: "nowrap" }}>{item.ropaId}</td>
                    <td style={{ padding: "12px 16px", color: "#1a1a1a", maxWidth: 200 }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#666", whiteSpace: "nowrap" }}>{item.department?.name ?? "—"}</td>
                    <td style={{ padding: "12px 16px", color: "#666", whiteSpace: "nowrap" }}>
                      {item.owner ? `${item.owner.firstName} ${item.owner.lastName}` : "—"}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span style={{ fontSize: 13, color: item.sections.length >= 12 ? "#2e7d32" : "#666" }}>
                        {item.sections.length}/13
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, whiteSpace: "nowrap" }}>{s.label}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#999", fontSize: 12, whiteSpace: "nowrap" }}>
                      {new Date(item.updatedAt).toLocaleDateString("th-TH")}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Link href={`/admin/ropa/${item.id}`} style={{ color: "#2e7d32", fontSize: 13, whiteSpace: "nowrap" }}>
                        ดูรายละเอียด →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
