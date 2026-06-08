"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ropaApi } from "@/lib/api/ropa"

type RopaItem = {
  id: string; ropaId: string; title: string
  status: string; version: number; updatedAt: string
}

const statusLabel: Record<string, { label: string; color: string; bg: string }> = {
  draft:     { label: "ร่าง",       color: "#666",    bg: "#f5f5f5" },
  submitted: { label: "รออนุมัติ", color: "#1565c0", bg: "#e3f2fd" },
  approved:  { label: "อนุมัติ",   color: "#2e7d32", bg: "#e8f5e9" },
  rejected:  { label: "ปฏิเสธ",   color: "#e53935", bg: "#ffebee" },
  revision:  { label: "แก้ไข",    color: "#e65100", bg: "#fff3e0" },
}

export default function RopaListPage() {
  const [items, setItems] = useState<RopaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ropaApi.getAll().then(setItems).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: "#1a1a1a" }}>รายการกิจกรรม ROPA</h1>
          <p style={{ fontSize: 13, color: "#666", marginTop: 2 }}>บันทึกกิจกรรมการประมวลผลข้อมูลส่วนบุคคล</p>
        </div>
        <Link href="/ropa/new"
          style={{ background: "#2e7d32", color: "#fff", padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
          + สร้างใหม่
        </Link>
      </div>

      <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#999", fontSize: 14 }}>กำลังโหลด...</div>
        ) : items.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "#999", fontSize: 14 }}>ยังไม่มีรายการ ROPA</p>
            <Link href="/ropa/new" style={{ color: "#2e7d32", fontSize: 14 }}>สร้างรายการแรก →</Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid #e0e0e0" }}>
                {["รหัส ROPA", "ชื่อกิจกรรม", "เวอร์ชัน", "สถานะ", "อัปเดต", ""].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, color: "#666", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const s = statusLabel[item.status] ?? statusLabel.draft
                return (
                  <tr key={item.id} style={{ borderBottom: "0.5px solid #f0f0f0" }}>
                    <td style={{ padding: "12px 16px", color: "#2e7d32", fontWeight: 500 }}>{item.ropaId}</td>
                    <td style={{ padding: "12px 16px", color: "#1a1a1a" }}>{item.title}</td>
                    <td style={{ padding: "12px 16px", color: "#666" }}>v{item.version}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>{s.label}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#999", fontSize: 12 }}>
                      {new Date(item.updatedAt).toLocaleDateString("th-TH")}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Link href={`/ropa/${item.id}`} style={{ color: "#2e7d32", fontSize: 13 }}>ดูรายละเอียด →</Link>
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
