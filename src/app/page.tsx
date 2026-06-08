"use client"
import { useState } from "react"
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

export default function HomePage() {
  const [current, setCurrent] = useState(1)
  const [formData, setFormData] = useState<Record<number, FormData>>({})
  const [submitted, setSubmitted] = useState(false)

  const saveSection = (no: number, data: FormData) => {
    const updated = { ...formData, [no]: data }
    setFormData(updated)
    localStorage.setItem('ropa_form_draft', JSON.stringify({ formData: updated, current }))
  }

  const next = () => setCurrent(c => Math.min(c + 1, 13))
  const prev = () => setCurrent(c => Math.max(c - 1, 1))

  const handleSubmit = async () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e0e0e0", padding: "3rem 2rem", textAlign: "center", maxWidth: 480 }}>
          <div style={{ width: 64, height: 64, background: "#e8f5e9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a", marginBottom: 8 }}>ส่งแบบฟอร์มสำเร็จ</h2>
          <p style={{ fontSize: 14, color: "#666", marginBottom: "1.5rem" }}>ข้อมูลของท่านถูกบันทึกแล้ว เจ้าหน้าที่จะตรวจสอบและติดต่อกลับ</p>
          <button onClick={() => { setSubmitted(false); setCurrent(1); setFormData({}) }}
            style={{ background: "#2e7d32", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, cursor: "pointer" }}>
            กรอกแบบฟอร์มใหม่
          </button>
        </div>
      </div>
    )
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
    13: <Section13 data={formData[13] ?? {}} onSave={d => saveSection(13, d)} onPrev={prev} onSubmit={() => handleSubmit()} />,
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <header style={{ background: "#2e7d32", color: "#fff", padding: "14px 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>แบบฟอร์มทะเบียนกิจกรรมการประมวลผลข้อมูลส่วนบุคคล</div>
          <div style={{ fontSize: 12, opacity: .8, marginTop: 2 }}>มหาวิทยาลัยราชภัฏมหาสารคาม (Record of Processing Activities : ROPA)</div>
        </div>

      </header>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem 1rem" }}>
        <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "1rem 1.25rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {SECTIONS.map(s => (
              <div key={s.no} onClick={() => setCurrent(s.no)}
                style={{ flex: "0 0 auto", padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                  background: current === s.no ? "#2e7d32" : current > s.no ? "#e8f5e9" : "#f5f5f5",
                  color: current === s.no ? "#fff" : current > s.no ? "#2e7d32" : "#999",
                  fontWeight: current === s.no ? 500 : 400 }}>
                {s.no}. {s.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e0e0e0", padding: "1.5rem" }}>
          {sectionComponents[current]}
        </div>
      </div>
    </div>
  )
}
