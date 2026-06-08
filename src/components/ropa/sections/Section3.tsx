"use client"
import { useState } from "react"
import { G, Checkbox, type SectionProps } from "./shared"

const SUBJECTS = [
  { key:"student",    label:"นักศึกษา" },
  { key:"applicant",  label:"ผู้สมัครเรียน" },
  { key:"alumni",     label:"ศิษย์เก่า" },
  { key:"staff",      label:"บุคลากร" },
  { key:"employee",   label:"ลูกจ้าง" },
  { key:"contractor", label:"ผู้รับจ้าง" },
  { key:"researcher", label:"นักวิจัย" },
  { key:"research_volunteer", label:"อาสาสมัครวิจัย" },
  { key:"trainee",   label:"ผู้เข้ารับการอบรม" },
  { key:"visitor",   label:"ผู้มาติดต่อราชการ" },
  { key:"it_user",   label:"ผู้ใช้บริการระบบสารสนเทศ" },
  { key:"other",     label:"อื่น ๆ" },
]

export default function Section3({ data, onSave, onNext, onPrev }: SectionProps) {
  const [subjects, setSubjects] = useState<string[]>(data.dataSubjects as string[] ?? [])
  const [otherText, setOtherText] = useState(data.dataSubjectOther as string ?? "")
  const toggle = (k: string) => setSubjects(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k])
  const handleNext = () => { onSave({ dataSubjects: subjects, dataSubjectOther: otherText }); onNext?.() }

  return (
    <div>
      <div style={G.title}>ส่วนที่ 3 เจ้าของข้อมูลส่วนบุคคล (Data Subject)</div>
      <div style={G.row}>
        <label style={G.label}>ประเภทเจ้าของข้อมูล <span style={{color:"#e53935"}}>*</span></label>
        <div style={{border:"0.5px solid #e0e0e0", borderRadius:8, padding:"0.75rem 1rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1rem"}}>
          {SUBJECTS.map(s => (
            <Checkbox key={s.key} label={s.label} checked={subjects.includes(s.key)} onChange={() => toggle(s.key)} />
          ))}
        </div>
        {subjects.includes("other") && (
          <input style={{...G.input, marginTop:8}} value={otherText} onChange={e => setOtherText(e.target.value)} placeholder="ระบุประเภทอื่น ๆ" />
        )}
      </div>
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}
