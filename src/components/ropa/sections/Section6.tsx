"use client"
import { useState } from "react"
import { G, Checkbox, type SectionProps } from "./shared"
const SOURCES = [
  { key:"data_subject",      label:"เจ้าของข้อมูลโดยตรง" },
  { key:"internal",          label:"หน่วยงานภายใน" },
  { key:"external",          label:"หน่วยงานภายนอก" },
  { key:"information_system",label:"ระบบสารสนเทศ" },
  { key:"website",           label:"เว็บไซต์" },
  { key:"application",       label:"แอปพลิเคชัน" },
  { key:"other",             label:"อื่น ๆ" },
]
export default function Section6({ data, onSave, onNext, onPrev }: SectionProps) {
  const [sources, setSources] = useState<string[]>(data.sources as string[] ?? [])
  const [otherText, setOtherText] = useState(data.sourceOther as string ?? "")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const toggle = (k: string) => {
    setSources(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k])
    if (errors.sources) setErrors(p => ({ ...p, sources: "" }))
  }
  const handleNext = () => {
    if (sources.length === 0) { setErrors({ sources: "กรุณาเลือกแหล่งที่มาอย่างน้อย 1 แหล่ง" }); return }
    onSave({ sources, sourceOther: otherText }); onNext?.()
  }
  return (
    <div>
      <div style={G.title}>ส่วนที่ 6 แหล่งที่มาของข้อมูลส่วนบุคคล</div>
      <div style={G.row}>
        <label style={G.label}>แหล่งที่มา <span style={{color:"#e53935"}}>*</span></label>
        <div style={{border: errors.sources ? "1px solid #e53935" : "0.5px solid #e0e0e0", borderRadius:8, padding:"0.75rem 1rem"}}>
          {SOURCES.map(s => <Checkbox key={s.key} label={s.label} checked={sources.includes(s.key)} onChange={() => toggle(s.key)} />)}
        </div>
        {errors.sources && <div style={{fontSize:12, color:"#e53935", marginTop:4}}>{errors.sources}</div>}
        {sources.includes("other") && (
          <input style={{...G.input, marginTop:8}} value={otherText} onChange={e => setOtherText(e.target.value)} placeholder="ระบุแหล่งที่มาอื่น ๆ" />
        )}
      </div>
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}
