"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import * as XLSX from "xlsx"
import { cioApi } from "@/lib/api/cio"
import { apiClient } from "@/lib/api/client"
import { STATUS, SECTION_LABELS, FIELD_LABELS, renderValue } from "@/lib/ropaLabels"

type Section = { sectionNumber: number; data: Record<string, unknown>; updatedAt: string }
type RopaDetail = {
  id: string; ropaId: string; title: string; status: string; version: number
  ownerPosition: string | null; ownerPhone: string | null; ownerEmail: string | null
  submittedAt: string | null; createdAt: string; updatedAt: string
  department: { name: string } | null
  owner: { firstName: string; lastName: string; email: string } | null
  sections: Section[]
  approvals: { status: string; comment: string | null; signedAt: string | null; approver: { firstName: string; lastName: string; email: string } }[]
}

export default function CioRopaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const [ropa, setRopa] = useState<RopaDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState<"approved" | "rejected" | null>(null)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  const load = () => {
    if (params.id) {
      cioApi.getById(params.id as string)
        .then(setRopa)
        .catch(() => router.push("/cio/approvals"))
        .finally(() => setLoading(false))
    }
  }

  useEffect(() => {
    if (status === "authenticated") load()
  }, [params.id, status])

  const handleReview = async () => {
    if (!showReviewModal) return
    setSubmitting(true)
    try {
      await cioApi.review(params.id as string, showReviewModal, comment || undefined)
      setShowReviewModal(null)
      setComment("")
      load()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      alert(e.response?.data?.message ?? "เกิดข้อผิดพลาด")
    } finally {
      setSubmitting(false)
    }
  }

  const handlePrint = () => window.print()

  const handleExportExcel = () => {
    if (!ropa) return
    const sorted = [...ropa.sections].sort((a, b) => a.sectionNumber - b.sectionNumber)
    const rows: unknown[][] = [["ส่วนที่", "หัวข้อ", "รายการ", "ข้อมูล"]]
    sorted.forEach(sec => {
      Object.entries(sec.data).forEach(([key, val]) => {
        rows.push([sec.sectionNumber, SECTION_LABELS[sec.sectionNumber] ?? "", FIELD_LABELS[key] ?? key, renderValue(key, val)])
      })
    })
    const ws = XLSX.utils.aoa_to_sheet(rows)
    ws["!cols"] = [{ wch: 8 }, { wch: 25 }, { wch: 30 }, { wch: 50 }]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "ROPA")
    XLSX.writeFile(wb, `${ropa.ropaId}.xlsx`)
  }

  const handleExportPDF = async () => {
    if (!ropa) return
    try {
      const res = await apiClient.get(`/ropa/${ropa.id}/pdf`, { responseType: "blob" })
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }))
      const a = document.createElement("a")
      a.href = url
      a.download = `${ropa.ropaId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch {
      alert("เกิดข้อผิดพลาดในการสร้าง PDF กรุณาลองใหม่")
    }
  }

  if (loading || status === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#666" }}>กำลังโหลด...</div>
  )
  if (!ropa) return null

  const s = STATUS[ropa.status] ?? STATUS.draft
  const sortedSections = [...ropa.sections].sort((a, b) => a.sectionNumber - b.sectionNumber)
  const canReview = ropa.status === "submitted"

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <header style={{ background: "#1a237e", color: "#fff", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => router.push("/cio/approvals")}
          style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 6, padding: "5px 12px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
          ← กลับ
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 500 }}>รายละเอียด ROPA — CIO</div>
          <div style={{ fontSize: 11, opacity: .75 }}>มหาวิทยาลัยราชภัฏมหาสารคาม</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handlePrint} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>🖨️ พิมพ์</button>
          <button onClick={handleExportExcel} style={{ background: "#1b5e20", border: "none", color: "#fff", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>📊 Excel</button>
          <button onClick={handleExportPDF} style={{ background: "#b71c1c", border: "none", color: "#fff", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>📄 PDF</button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* Info card */}
        <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#1a237e" }}>{ropa.ropaId}</span>
                <span style={{ background: s.bg, color: s.color, padding: "3px 12px", borderRadius: 20, fontSize: 13 }}>{s.label}</span>
              </div>
              <h1 style={{ fontSize: 16, fontWeight: 500, color: "#1a1a1a", marginBottom: 12 }}>{ropa.title}</h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 24px", fontSize: 13 }}>
                <div><span style={{ color: "#999" }}>หน่วยงาน: </span>{ropa.department?.name ?? "-"}</div>
                <div><span style={{ color: "#999" }}>ผู้ส่ง: </span>{ropa.owner ? `${ropa.owner.firstName} ${ropa.owner.lastName}` : "-"}</div>
                {ropa.submittedAt && <div><span style={{ color: "#999" }}>วันที่ส่ง: </span>{new Date(ropa.submittedAt).toLocaleDateString("th-TH")}</div>}
              </div>
            </div>
            {canReview && (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setShowReviewModal("approved")}
                  style={{ background: "#2e7d32", border: "none", color: "#fff", borderRadius: 8, padding: "10px 20px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
                  ✓ อนุมัติ
                </button>
                <button onClick={() => setShowReviewModal("rejected")}
                  style={{ background: "#c62828", border: "none", color: "#fff", borderRadius: 8, padding: "10px 20px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
                  ✗ ไม่อนุมัติ
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Approval history */}
        {ropa.approvals.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "1rem 1.25rem", marginBottom: "1rem" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "#555" }}>ประวัติการพิจารณา</div>
            {ropa.approvals.map((a, i) => (
              <div key={i} style={{ fontSize: 13, padding: "6px 0", borderTop: i > 0 ? "0.5px solid #f0f0f0" : "none" }}>
                <span style={{ color: a.status === "approved" ? "#2e7d32" : "#c62828", fontWeight: 500 }}>
                  {a.status === "approved" ? "✓ อนุมัติ" : "✗ ไม่อนุมัติ"}
                </span>
                {" โดย "}{a.approver.firstName} {a.approver.lastName}
                {a.signedAt && <span style={{ color: "#999" }}> — {new Date(a.signedAt).toLocaleDateString("th-TH")}</span>}
                {a.comment && <div style={{ color: "#666", marginTop: 2 }}>หมายเหตุ: {a.comment}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Sections */}
        {sortedSections.map(sec => (
          <div key={sec.sectionNumber} style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", marginBottom: "0.75rem", overflow: "hidden" }}>
            <div style={{ background: "#1a237e", padding: "10px 16px" }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>ส่วนที่ {sec.sectionNumber} — {SECTION_LABELS[sec.sectionNumber]}</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <tbody>
                {Object.entries(sec.data).map(([key, val], idx) => (
                  <tr key={key} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
                    <td style={{ padding: "10px 16px", color: "#555", width: "35%", fontWeight: 500, borderRight: "0.5px solid #e0e0e0", borderBottom: "0.5px solid #e0e0e0" }}>
                      {FIELD_LABELS[key] ?? key}
                    </td>
                    <td style={{ padding: "10px 16px", color: "#1a1a1a", borderBottom: "0.5px solid #e0e0e0" }}>
                      {renderValue(key, val)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Review modal */}
      {showReviewModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", width: "100%", maxWidth: 420 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: showReviewModal === "approved" ? "#2e7d32" : "#c62828" }}>
              {showReviewModal === "approved" ? "ยืนยันการอนุมัติ" : "ยืนยันการไม่อนุมัติ"}
            </h3>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
              {showReviewModal === "approved"
                ? `ยืนยันการอนุมัติ ${ropa.ropaId} ใช่หรือไม่?`
                : `${ropa.ropaId} จะถูกส่งกลับให้ผู้ส่งแก้ไข (สถานะ: ต้องแก้ไข)`}
            </p>
            <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 4 }}>หมายเหตุ (ถ้ามี)</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
              style={{ width: "100%", padding: "8px 10px", border: "0.5px solid #ccc", borderRadius: 6, fontSize: 13, fontFamily: "inherit", marginBottom: 16, resize: "vertical" }}
              placeholder="ระบุความเห็นเพิ่มเติม..." />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => { setShowReviewModal(null); setComment("") }} disabled={submitting}
                style={{ padding: "8px 16px", border: "0.5px solid #ccc", borderRadius: 6, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                ยกเลิก
              </button>
              <button onClick={handleReview} disabled={submitting}
                style={{ padding: "8px 16px", border: "none", borderRadius: 6, background: showReviewModal === "approved" ? "#2e7d32" : "#c62828", color: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                {submitting ? "กำลังบันทึก..." : "ยืนยัน"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
