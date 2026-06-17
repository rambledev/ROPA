"use client"
import { useState } from "react"
import { G, Checkbox, type SectionProps } from "./shared"

const PURPOSES = [
  { key:"education",           label:"การจัดการศึกษา" },
  { key:"hr",                  label:"การบริหารงานบุคคล" },
  { key:"research",            label:"การวิจัย" },
  { key:"academic_service",    label:"การบริการวิชาการ" },
  { key:"internal_management", label:"การบริหารจัดการภายใน" },
  { key:"other",               label:"อื่น ๆ" },
]

export default function Section2({ data, onSave, onNext, onPrev }: SectionProps) {
  const [detail, setDetail]           = useState(data.activityDetail as string ?? "")
  const [purposes, setPurposes]       = useState<string[]>(data.purposes as string[] ?? [])
  const [otherText, setOtherText]     = useState(data.purposeOther as string ?? "")
  const [purposeDetail, setPurposeDetail] = useState(data.purposeDetail as string ?? "")
  const [errors, setErrors]           = useState<Record<string, string>>({})

  const toggle = (k: string) => {
    setPurposes(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k])
    if (errors.purposes) setErrors(p => ({ ...p, purposes: "" }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!detail.trim())         e.detail        = "กรุณาระบุรายละเอียดกิจกรรม"
    if (purposes.length === 0)  e.purposes      = "กรุณาเลือกวัตถุประสงค์อย่างน้อย 1 ข้อ"
    if (!purposeDetail.trim())  e.purposeDetail = "กรุณาระบุวัตถุประสงค์โดยละเอียด"
    return e
  }

  const handleNext = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onSave({ activityDetail: detail, purposes, purposeOther: otherText, purposeDetail })
    onNext?.()
  }

  const Err = ({ field }: { field: string }) =>
    errors[field] ? <div style={{ fontSize: 12, color: "#e53935", marginTop: 4 }}>{errors[field]}</div> : null

  const inputStyle = (field: string) => ({
    ...G.input, border: errors[field] ? "1px solid #e53935" : G.input.border,
  })
  const textareaStyle = (field: string) => ({
    ...G.textarea, border: errors[field] ? "1px solid #e53935" : G.textarea.border,
  })

  return (
    <div>
      <div style={G.title}>ส่วนที่ 2 รายละเอียดกิจกรรมการประมวลผลข้อมูลส่วนบุคคล</div>
      <div style={G.row}>
        <label style={G.label}>รายละเอียดกิจกรรม <span style={{color:"#e53935"}}>*</span></label>
        <textarea style={textareaStyle("detail")} value={detail}
          onChange={e => { setDetail(e.target.value); if (errors.detail) setErrors(p => ({...p, detail:""})) }}
          placeholder="อธิบายรายละเอียดกิจกรรมการประมวลผล" />
        <Err field="detail" />
      </div>
      <div style={G.row}>
        <label style={G.label}>วัตถุประสงค์ในการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล <span style={{color:"#e53935"}}>*</span></label>
        <div style={{border: errors.purposes ? "1px solid #e53935" : "0.5px solid #e0e0e0", borderRadius:8, padding:"0.75rem 1rem"}}>
          {PURPOSES.map(p => (
            <Checkbox key={p.key} label={p.label} checked={purposes.includes(p.key)} onChange={() => toggle(p.key)} />
          ))}
          {purposes.includes("other") && (
            <input style={{...G.input, marginTop:8}} value={otherText}
              onChange={e => setOtherText(e.target.value)} placeholder="ระบุวัตถุประสงค์อื่น ๆ" />
          )}
        </div>
        <Err field="purposes" />
      </div>
      <div style={G.row}>
        <label style={G.label}>วัตถุประสงค์โดยละเอียด <span style={{color:"#e53935"}}>*</span></label>
        <textarea style={textareaStyle("purposeDetail")} value={purposeDetail}
          onChange={e => { setPurposeDetail(e.target.value); if (errors.purposeDetail) setErrors(p => ({...p, purposeDetail:""})) }}
          placeholder="อธิบายวัตถุประสงค์โดยละเอียด" />
        <Err field="purposeDetail" />
      </div>
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}
