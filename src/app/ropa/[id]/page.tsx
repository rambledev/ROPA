"use client"
import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { apiClient } from "@/lib/api/client"

type Section = { sectionNumber: number; data: Record<string, unknown>; updatedAt: string }
type RopaDetail = {
  id: string; ropaId: string; title: string; status: string; version: number
  ownerPosition: string | null; ownerPhone: string | null; ownerEmail: string | null
  submittedAt: string | null; createdAt: string; updatedAt: string
  sections: Section[]
}

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  draft:     { label: "ร่าง",       color: "#666",    bg: "#f5f5f5" },
  submitted: { label: "รออนุมัติ", color: "#1565c0", bg: "#e3f2fd" },
  approved:  { label: "อนุมัติ",   color: "#2e7d32", bg: "#e8f5e9" },
  rejected:  { label: "ปฏิเสธ",   color: "#e53935", bg: "#ffebee" },
}

const SECTION_LABELS: Record<number, string> = {
  1:"ข้อมูลทั่วไป", 2:"รายละเอียดกิจกรรม", 3:"เจ้าของข้อมูล",
  4:"ประเภทข้อมูล", 5:"ฐานกฎหมาย", 6:"แหล่งที่มา",
  7:"ผู้รับข้อมูล", 8:"โอนข้อมูลต่างประเทศ", 9:"ระบบสารสนเทศ",
  10:"ระยะเวลาเก็บรักษา", 11:"มาตรการความปลอดภัย",
  12:"ประเมินความเสี่ยง", 13:"การรับรอง",
}

const FIELD_LABELS: Record<string, string> = {
  departmentName:"ชื่อหน่วยงาน", title:"ชื่อกิจกรรม", ropaId:"รหัส ROPA",
  ownerName:"ชื่อผู้รับผิดชอบ", ownerPosition:"ตำแหน่ง", ownerPhone:"โทรศัพท์",
  ownerEmail:"อีเมล", createdDate:"วันที่จัดทำ", updatedDate:"วันที่ปรับปรุง",
  activityDetail:"รายละเอียดกิจกรรม", purposes:"วัตถุประสงค์", purposeDetail:"วัตถุประสงค์โดยละเอียด",
  purposeOther:"วัตถุประสงค์อื่น ๆ",
  dataSubjects:"ประเภทเจ้าของข้อมูล", dataSubjectOther:"อื่น ๆ",
  generalData:"ข้อมูลทั่วไป", sensitiveData:"ข้อมูลอ่อนไหว",
  generalDataOther:"ข้อมูลทั่วไปอื่น ๆ", sensitiveDataOther:"ข้อมูลอ่อนไหวอื่น ๆ",
  legalBases:"ฐานกฎหมาย", legalBasisDetail:"รายละเอียดฐานกฎหมาย",
  sources:"แหล่งที่มา", sourceOther:"แหล่งที่มาอื่น ๆ",
  internalRecipients:"ผู้รับข้อมูลภายใน", externalRecipients:"ผู้รับข้อมูลภายนอก",
  disclosureReason:"เหตุผลในการเปิดเผย",
  hasTransfer:"มีการโอนต่างประเทศ", destinationCountry:"ประเทศปลายทาง",
  safeguardMeasures:"มาตรการคุ้มครอง",
  systems:"ระบบสารสนเทศ", systemOther:"ระบบอื่น ๆ",
  retentionPeriod:"ระยะเวลาเก็บรักษา", legalReference:"อ้างอิงกฎหมาย",
  destructionMethods:"วิธีทำลายข้อมูล", destructionOther:"วิธีอื่น ๆ",
  technicalMeasures:"มาตรการด้านเทคนิค", adminMeasures:"มาตรการด้านบริหาร",
  riskLevel:"ระดับความเสี่ยง", requiresDpia:"ต้องทำ DPIA", dpiaDetail:"รายละเอียด DPIA",
  makerName:"ชื่อผู้จัดทำ", makerPosition:"ตำแหน่งผู้จัดทำ", makerDate:"วันที่จัดทำ",
  supervisorName:"ชื่อผู้บังคับบัญชา", supervisorPosition:"ตำแหน่งผู้บังคับบัญชา",
  supervisorDate:"วันที่ลงนาม", dpoName:"ชื่อ DPO", dpoDate:"วันที่ DPO ลงนาม",
}

const RISK_LABELS: Record<string, string> = {
  low:"ต่ำ", medium:"ปานกลาง", high:"สูง", very_high:"สูงมาก"
}

const renderValue = (key: string, val: unknown): string => {
  if (val === null || val === undefined || val === "") return "-"
  if (typeof val === "boolean") return val ? "ใช่" : "ไม่ใช่"
  if (Array.isArray(val)) return val.length === 0 ? "-" : val.join(", ")
  if (key === "riskLevel") return RISK_LABELS[String(val)] ?? String(val)
  return String(val)
}

export default function RopaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { status } = useSession()
  const [ropa, setRopa] = useState<RopaDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (params.id && status === "authenticated") {
      apiClient.get(`/ropa/${params.id}`)
        .then(res => setRopa(res.data.data))
        .catch(() => router.push("/"))
        .finally(() => setLoading(false))
    }
  }, [params.id, status, router])

  const handlePrint = () => window.print()

  const handleExportExcel = () => {
    const rows: unknown[][] = [["ส่วนที่", "หัวข้อ", "รายการ", "ข้อมูล"]]
    sortedSections.forEach(sec => {
      Object.entries(sec.data).forEach(([key, val]) => {
        rows.push([
          sec.sectionNumber,
          SECTION_LABELS[sec.sectionNumber] ?? "",
          FIELD_LABELS[key] ?? key,
          renderValue(key, val)
        ])
      })
    })
    const ws = XLSX.utils.aoa_to_sheet(rows)
    ws["!cols"] = [{ wch: 8 }, { wch: 25 }, { wch: 30 }, { wch: 50 }]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "ROPA")
    XLSX.writeFile(wb, `${ropa?.ropaId ?? "ROPA"}.xlsx`)
  }

  const handleExportPDF = async () => {
    try {
      const res = await apiClient.get(`/ropa/${params.id}/pdf`, {
        responseType: "blob"
      })
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }))
      const a = document.createElement("a")
      a.href = url
      a.download = `${ropa?.ropaId ?? "ROPA"}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch {
      alert("เกิดข้อผิดพลาดในการสร้าง PDF กรุณาลองใหม่")
    }
  }

  const handleExportPDFOld = () => {
    const printContent = `
      <!DOCTYPE html><html><head>
      <meta charset="utf-8">
      <title>${ropa?.ropaId ?? "ROPA"}</title>
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:"Sarabun",sans-serif; font-size:13px; color:#1a1a1a; padding:20px; }
        h1 { font-size:16px; font-weight:600; margin-bottom:4px; }
        .meta { font-size:11px; color:#666; margin-bottom:16px; }
        .section { margin-bottom:16px; border:1px solid #e0e0e0; border-radius:6px; overflow:hidden; page-break-inside:avoid; }
        .section-header { background:#2e7d32; color:white; padding:7px 12px; font-size:12px; font-weight:500; }
        table { width:100%; border-collapse:collapse; }
        td { padding:7px 12px; border-bottom:1px solid #e0e0e0; font-size:12px; vertical-align:top; }
        td:first-child { width:35%; background:#f9fafb; font-weight:500; color:#555; border-right:1px solid #e0e0e0; }
        tr:last-child td { border-bottom:none; }
      </style>
      </head><body>
      <h1>${ropa?.ropaId ?? ""} — ${ropa?.title ?? ""}</h1>
      <div class="meta">สถานะ: ${STATUS[ropa?.status ?? "draft"]?.label ?? ""} | วันที่สร้าง: ${new Date(ropa?.createdAt ?? "").toLocaleDateString("th-TH")} | พิมพ์เมื่อ: ${new Date().toLocaleDateString("th-TH")}</div>
      ${sortedSections.map(sec => `
        <div class="section">
          <div class="section-header">ส่วนที่ ${sec.sectionNumber} — ${SECTION_LABELS[sec.sectionNumber] ?? ""}</div>
          <table>${Object.entries(sec.data).map(([key, val]) => `
            <tr><td>${FIELD_LABELS[key] ?? key}</td><td>${renderValue(key, val)}</td></tr>
          `).join("")}</table>
        </div>`).join("")}
      </body></html>
    `
    const win = window.open("", "_blank")
    if (win) {
      win.document.write(printContent)
      win.document.close()
      win.onload = () => {
        win.document.fonts.ready.then(() => {
          setTimeout(() => { win.focus(); win.print() }, 1000)
        })
      }
    }
  }

  if (loading || status === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#666" }}>กำลังโหลด...</div>
  )
  if (!ropa) return null

  const s = STATUS[ropa.status] ?? STATUS.draft
  const sortedSections = [...ropa.sections].sort((a, b) => a.sectionNumber - b.sectionNumber)

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* Header */}
      <header style={{ background: "#2e7d32", color: "#fff", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => router.push("/")}
          style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 6, padding: "5px 12px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
          ← กลับ
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 500 }}>รายละเอียด ROPA</div>
          <div style={{ fontSize: 11, opacity: .75 }}>มหาวิทยาลัยราชภัฏมหาสารคาม</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handlePrint}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
            🖨️ พิมพ์
          </button>
          <button onClick={handleExportExcel}
            style={{ background: "#1b5e20", border: "none", color: "#fff", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
            📊 Excel
          </button>
          <button onClick={handleExportPDF}
            style={{ background: "#b71c1c", border: "none", color: "#fff", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
            📄 PDF
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* Info Card */}
        <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#2e7d32" }}>{ropa.ropaId}</span>
                <span style={{ background: s.bg, color: s.color, padding: "3px 12px", borderRadius: 20, fontSize: 13 }}>{s.label}</span>
                <span style={{ fontSize: 12, color: "#999" }}>เวอร์ชัน {ropa.version}</span>
              </div>
              <h1 style={{ fontSize: 16, fontWeight: 500, color: "#1a1a1a", marginBottom: 12 }}>{ropa.title}</h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 24px", fontSize: 13 }}>
                {ropa.ownerPosition && <div><span style={{ color: "#999" }}>ตำแหน่ง: </span>{ropa.ownerPosition}</div>}
                {ropa.ownerPhone    && <div><span style={{ color: "#999" }}>โทร: </span>{ropa.ownerPhone}</div>}
                {ropa.ownerEmail    && <div><span style={{ color: "#999" }}>อีเมล: </span>{ropa.ownerEmail}</div>}
                <div><span style={{ color: "#999" }}>วันที่สร้าง: </span>{new Date(ropa.createdAt).toLocaleDateString("th-TH")}</div>
                {ropa.submittedAt && <div><span style={{ color: "#999" }}>วันที่ส่ง: </span>{new Date(ropa.submittedAt).toLocaleDateString("th-TH")}</div>}
              </div>
            </div>
            <div style={{ background: "#f9fafb", borderRadius: 8, padding: "0.75rem 1rem", textAlign: "center", minWidth: 100 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#2e7d32" }}>
                {ropa.sections.length}<span style={{ fontSize: 14, color: "#999" }}>/13</span>
              </div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>ส่วนที่กรอก</div>
              <div style={{ height: 4, background: "#e0e0e0", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#2e7d32", width: `${(ropa.sections.length/13)*100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Sections Table */}
        {sortedSections.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "2rem", textAlign: "center", color: "#999", fontSize: 14 }}>
            ยังไม่มีข้อมูล
          </div>
        ) : sortedSections.map(sec => (
          <div key={sec.sectionNumber} style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", marginBottom: "0.75rem", overflow: "hidden" }}>
            {/* Section Header */}
            <div style={{ background: "#2e7d32", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 24, height: 24, background: "rgba(255,255,255,0.25)", color: "#fff", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                {sec.sectionNumber}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>ส่วนที่ {sec.sectionNumber} — {SECTION_LABELS[sec.sectionNumber]}</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
                อัปเดต {new Date(sec.updatedAt).toLocaleDateString("th-TH")}
              </span>
            </div>
            {/* Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, border: "0.5px solid #e0e0e0" }}>
              <tbody>
                {Object.entries(sec.data).map(([key, val], idx) => (
                  <tr key={key} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb" }}>
                    <td style={{ padding: "10px 16px", color: "#555", width: "35%", fontWeight: 500, verticalAlign: "top", borderRight: "0.5px solid #e0e0e0", borderBottom: "0.5px solid #e0e0e0", background: idx % 2 === 0 ? "#f9fafb" : "#f3f4f6" }}>
                      {FIELD_LABELS[key] ?? key}
                    </td>
                    <td style={{ padding: "10px 16px", color: "#1a1a1a", verticalAlign: "top", borderBottom: "0.5px solid #e0e0e0" }}>
                      {renderValue(key, val)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}
