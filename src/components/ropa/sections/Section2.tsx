"use client"
import { useState } from "react"
import { G, Checkbox, type SectionProps } from "./shared"

const PURPOSES = [
  { key:"education",          label:"การจัดการศึกษา" },
  { key:"hr",                 label:"การบริหารงานบุคคล" },
  { key:"research",           label:"การวิจัย" },
  { key:"academic_service",   label:"การบริการวิชาการ" },
  { key:"internal_management",label:"การบริหารจัดการภายใน" },
  { key:"other",              label:"อื่น ๆ" },
]

export default function Section2({ data, onSave, onNext, onPrev }: SectionProps) {
  const [detail, setDetail]   = useState(data.activityDetail as string ?? "")
  const [purposes, setPurposes] = useState<string[]>(data.purposes as string[] ?? [])
  const [otherText, setOtherText] = useState(data.purposeOther as string ?? "")
  const [purposeDetail, setPurposeDetail] = useState(data.purposeDetail as string ?? "")

  const toggle = (k: string) => setPurposes(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k])
  const handleNext = () => { onSave({ activityDetail: detail, purposes, purposeOther: otherText, purposeDetail }); onNext?.() }

  return (
    <div>
      <div style={G.title}>ส่วนที่ 2 รายละเอียดกิจกรรมการประมวลผลข้อมูลส่วนบุคคล</div>
      <div style={G.row}>
        <label style={G.label}>รายละเอียดกิจกรรม <span style={{color:"#e53935"}}>*</span></label>
        <textarea style={G.textarea} value={detail} onChange={e => setDetail(e.target.value)} placeholder="อธิบายรายละเอียดกิจกรรมการประมวลผล" />
      </div>
      <div style={G.row}>
        <label style={G.label}>วัตถุประสงค์ในการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล <span style={{color:"#e53935"}}>*</span></label>
        <div style={{border:"0.5px solid #e0e0e0", borderRadius:8, padding:"0.75rem 1rem"}}>
          {PURPOSES.map(p => (
            <Checkbox key={p.key} label={p.label} checked={purposes.includes(p.key)} onChange={() => toggle(p.key)} />
          ))}
          {purposes.includes("other") && (
            <input style={{...G.input, marginTop:8}} value={otherText} onChange={e => setOtherText(e.target.value)} placeholder="ระบุวัตถุประสงค์อื่น ๆ" />
          )}
        </div>
      </div>
      <div style={G.row}>
        <label style={G.label}>วัตถุประสงค์โดยละเอียด</label>
        <textarea style={G.textarea} value={purposeDetail} onChange={e => setPurposeDetail(e.target.value)} placeholder="อธิบายวัตถุประสงค์โดยละเอียด" />
      </div>
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}
