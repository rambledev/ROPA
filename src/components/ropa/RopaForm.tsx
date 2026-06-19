"use client"
import { useState, useEffect } from "react"
import Section1 from "@/components/ropa/sections/Section1"
import Section2 from "@/components/ropa/sections/Section2"
import Section3 from "@/components/ropa/sections/Section3"
import Section4 from "@/components/ropa/sections/Section4"
import Section5 from "@/components/ropa/sections/Section5"
import Section6 from "@/components/ropa/sections/Section6"
import Section7 from "@/components/ropa/sections/Section7"
import Section8 from "@/components/ropa/sections/Section8"
import Section9 from "@/components/ropa/sections/Section9"
import Section10 from "@/components/ropa/sections/Section10"
import Section11 from "@/components/ropa/sections/Section11"
import Section12 from "@/components/ropa/sections/Section12"
import Section13 from "@/components/ropa/sections/Section13"
import { ropaApi } from "@/lib/api/ropa"

const STORAGE_KEY = "ropa_form_draft"
const SECTIONS = [
  { no: 1,  label: "ข้อมูลทั่วไป" },
  { no: 2,  label: "รายละเอียดกิจกรรม" },
  { no: 3,  label: "เจ้าของข้อมูล" },
  { no: 4,  label: "ประเภทข้อมูล" },
  { no: 5,  label: "ฐานกฎหมาย" },
  { no: 6,  label: "แหล่งที่มา" },
  { no: 7,  label: "ผู้รับข้อมูล" },
  { no: 8,  label: "โอนข้อมูลต่างประเทศ" },
  { no: 9,  label: "ระบบสารสนเทศ" },
  { no: 10, label: "ระยะเวลาเก็บรักษา" },
  { no: 11, label: "มาตรการความปลอดภัย" },
  { no: 12, label: "ประเมินความเสี่ยง" },
  { no: 13, label: "การรับรอง" },
]

export type FormData = Record<string, unknown>

type ModalState = {
  show: boolean; success: boolean; ropaId: string; message: string
}

type Props = {
  onSuccess: () => void
  editMode?: boolean
  ropaId?: string
  initialData?: Record<number, FormData>
}

export default function RopaForm({ onSuccess, editMode = false, ropaId, initialData }: Props) {
  const [current, setCurrent] = useState(1)
  const [formData, setFormData] = useState<Record<number, FormData>>(initialData ?? {})
  const [submitting, setSubmitting] = useState(false)
  const [modal, setModal] = useState<ModalState>({ show: false, success: false, ropaId: "", message: "" })

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setFormData(parsed.formData ?? {})
        setCurrent(parsed.current ?? 1)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, current }))
    }
  }, [formData, current])

  const saveSection = (no: number, data: FormData) => {
    const updated = { ...formData, [no]: data }
    setFormData(updated)
    if (!editMode) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData: updated, current }))
    }
  }

  const next = () => setCurrent(c => Math.min(c + 1, 13))
  const prev = () => setCurrent(c => Math.max(c - 1, 1))

  const clearForm = () => {
    setFormData({})
    setCurrent(1)
    localStorage.removeItem(STORAGE_KEY)
  }

  const REQUIRED_SECTIONS = [1, 2, 3, 4, 5, 6, 7, 10, 11, 13]

  const handleSubmit = async () => {
    const missing = REQUIRED_SECTIONS.filter(n => !formData[n] || Object.keys(formData[n] as object).length === 0)
    if (missing.length > 0) {
      const labels: Record<number, string> = {
        1: "ข้อมูลทั่วไป", 2: "รายละเอียดกิจกรรม", 3: "เจ้าของข้อมูล",
        4: "ประเภทข้อมูล", 5: "ฐานกฎหมาย", 6: "แหล่งที่มา",
        7: "ผู้รับข้อมูล", 10: "ระยะเวลาเก็บรักษา", 11: "มาตรการความปลอดภัย", 13: "การรับรอง"
      }
      setModal({
        show: true, success: false, ropaId: "",
        message: "กรุณากรอกข้อมูลให้ครบก่อนส่ง:\n" + missing.map(n => `ส่วนที่ ${n}: ${labels[n]}`).join(", ")
      })
      return
    }
    setSubmitting(true)
    try {
      const section1 = formData[1] as Record<string, string> ?? {}
      const title = section1.title ?? ""
      if (title.trim().length < 10) {
        setModal({ show: true, success: false, ropaId: "", message: "กรุณากรอกชื่อกิจกรรม (ส่วนที่ 1) อย่างน้อย 10 ตัวอักษร" })
        setSubmitting(false)
        return
      }

      if (editMode && ropaId) {
        // แก้ไข ROPA ที่มีอยู่แล้ว
        await ropaApi.update(ropaId, {
          title:         title,
          ownerPosition: section1.ownerPosition || undefined,
          ownerPhone:    section1.ownerPhone    || undefined,
          ownerEmail:    section1.ownerEmail    || undefined,
        })
        for (let i = 2; i <= 12; i++) {
          if (formData[i] && Object.keys(formData[i] as object).length > 0) {
            try { await ropaApi.saveSection(ropaId, i, formData[i]) } catch {}
          }
        }
        setModal({ show: true, success: true, ropaId: "", message: "บันทึกการแก้ไขสำเร็จแล้ว" })
        onSuccess()
        return
      }

      // สร้าง ROPA ใหม่
      const activity = await ropaApi.create({
        title:         title,
        ownerPosition: section1.ownerPosition || undefined,
        ownerPhone:    section1.ownerPhone    || undefined,
        ownerEmail:    section1.ownerEmail    || undefined,
      })
      for (let i = 2; i <= 12; i++) {
        if (formData[i] && Object.keys(formData[i] as object).length > 0) {
          try { await ropaApi.saveSection(activity.id, i, formData[i]) } catch {}
        }
      }
      await ropaApi.submit(activity.id)
      clearForm()
      setModal({ show: true, success: true, ropaId: activity.ropaId, message: "ลงทะเบียนกิจกรรมการประมวลผลข้อมูลส่วนบุคคลสำเร็จแล้ว เจ้าหน้าที่จะตรวจสอบและดำเนินการอนุมัติต่อไป" })
    } catch (err) {
      setModal({ show: true, success: false, ropaId: "", message: err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" })
    } finally {
      setSubmitting(false)
    }
  }

  const sectionComponents: Record<number, React.ReactNode> = {
    1:  <Section1  data={formData[1]  ?? {}} onSave={d => saveSection(1,  d)} onNext={next} />,
    2:  <Section2  data={formData[2]  ?? {}} onSave={d => saveSection(2,  d)} onNext={next} onPrev={prev} />,
    3:  <Section3  data={formData[3]  ?? {}} onSave={d => saveSection(3,  d)} onNext={next} onPrev={prev} />,
    4:  <Section4  data={formData[4]  ?? {}} onSave={d => saveSection(4,  d)} onNext={next} onPrev={prev} />,
    5:  <Section5  data={formData[5]  ?? {}} onSave={d => saveSection(5,  d)} onNext={next} onPrev={prev} />,
    6:  <Section6  data={formData[6]  ?? {}} onSave={d => saveSection(6,  d)} onNext={next} onPrev={prev} />,
    7:  <Section7  data={formData[7]  ?? {}} onSave={d => saveSection(7,  d)} onNext={next} onPrev={prev} />,
    8:  <Section8  data={formData[8]  ?? {}} onSave={d => saveSection(8,  d)} onNext={next} onPrev={prev} />,
    9:  <Section9  data={formData[9]  ?? {}} onSave={d => saveSection(9,  d)} onNext={next} onPrev={prev} />,
    10: <Section10 data={formData[10] ?? {}} onSave={d => saveSection(10, d)} onNext={next} onPrev={prev} />,
    11: <Section11 data={formData[11] ?? {}} onSave={d => saveSection(11, d)} onNext={next} onPrev={prev} />,
    12: <Section12 data={formData[12] ?? {}} onSave={d => saveSection(12, d)} onNext={next} onPrev={prev} />,
    13: <Section13 data={formData[13] ?? {}} onSave={d => saveSection(13, d)} onPrev={prev} onSubmit={handleSubmit} />,
  }

  const completedCount = Object.keys(formData).length
  const hasDraft = completedCount > 0

  return (
    <div>
      {/* Modal */}
      {modal.show && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "2rem", maxWidth: 460, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: modal.success ? "#e8f5e9" : "#ffebee", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                {modal.success
                  ? <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                }
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: modal.success ? "#2e7d32" : "#e53935", marginBottom: 8 }}>
                {modal.success ? "ลงทะเบียนสำเร็จ" : "เกิดข้อผิดพลาด"}
              </h2>
              {modal.success && modal.ropaId && (
                <div style={{ background: "#e8f5e9", borderRadius: 8, padding: "8px 16px", marginBottom: 12, display: "inline-block" }}>
                  <span style={{ fontSize: 13, color: "#666" }}>รหัสกิจกรรม: </span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#2e7d32" }}>{modal.ropaId}</span>
                </div>
              )}
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{modal.message}</p>
            </div>
            <button onClick={() => { setModal(m => ({ ...m, show: false })); if (modal.success) onSuccess() }}
              style={{ width: "100%", padding: "10px", background: modal.success ? "#2e7d32" : "#e53935", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              {modal.success ? "ดูรายการของฉัน" : "ปิด"}
            </button>
          </div>
        </div>
      )}

      {/* Draft notice */}
      {hasDraft && (
        <div style={{ background: "#e8f5e9", border: "0.5px solid #a5d6a7", borderRadius: 8, padding: "10px 16px", marginBottom: "1rem", fontSize: 13, color: "#2e7d32", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>✓ บันทึกร่างอัตโนมัติแล้ว ({completedCount}/13 ส่วน)</span>
          <button onClick={clearForm} style={{ background: "none", border: "none", color: "#e53935", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>ล้างฟอร์ม</button>
        </div>
      )}

      {/* Step indicator */}
      <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "1rem 1.25rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {SECTIONS.map(s => (
            <div key={s.no} onClick={() => setCurrent(s.no)}
              style={{ flex: "0 0 auto", padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                background: current === s.no ? "#2e7d32" : formData[s.no] ? "#e8f5e9" : "#f5f5f5",
                color: current === s.no ? "#fff" : formData[s.no] ? "#2e7d32" : "#999",
                fontWeight: current === s.no ? 500 : 400,
                border: formData[s.no] && current !== s.no ? "0.5px solid #a5d6a7" : "none" }}>
              {formData[s.no] ? "✓" : s.no}. {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "1.5rem", opacity: submitting ? 0.7 : 1, pointerEvents: submitting ? "none" : "auto" }}>
        {submitting
          ? <div style={{ textAlign: "center", padding: "3rem", color: "#2e7d32" }}><div style={{ fontSize: 16, marginBottom: 8 }}>กำลังบันทึกข้อมูล...</div></div>
          : sectionComponents[current]
        }
      </div>
    </div>
  )
}
