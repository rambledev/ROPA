"use client"
import { useState } from "react"
import { G, Checkbox, type SectionProps } from "./shared"
const BASES = [
  { key:"legal_obligation",   label:"การปฏิบัติหน้าที่ตามกฎหมาย" },
  { key:"public_task",        label:"การปฏิบัติภารกิจสาธารณะ" },
  { key:"contract",           label:"การปฏิบัติตามสัญญา" },
  { key:"consent",            label:"ความยินยอม" },
  { key:"legitimate_interest",label:"ประโยชน์โดยชอบด้วยกฎหมาย" },
  { key:"vital_interest",     label:"การป้องกันอันตรายต่อชีวิต" },
  { key:"historical_research",label:"การจัดทำเอกสารประวัติศาสตร์/วิจัย" },
]
export default function Section5({ data, onSave, onNext, onPrev }: SectionProps) {
  const [bases, setBases] = useState<string[]>(data.legalBases as string[] ?? [])
  const [detail, setDetail] = useState(data.legalBasisDetail as string ?? "")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const toggle = (k: string) => {
    setBases(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k])
    if (errors.bases) setErrors(p => ({ ...p, bases: "" }))
  }
  const handleNext = () => {
    if (bases.length === 0) { setErrors({ bases: "กรุณาเลือกฐานกฎหมายอย่างน้อย 1 ข้อ" }); return }
    onSave({ legalBases: bases, legalBasisDetail: detail }); onNext?.()
  }
  return (
    <div>
      <div style={G.title}>ส่วนที่ 5 ฐานกฎหมายในการประมวลผล</div>
      <div style={G.row}>
        <label style={G.label}>ฐานกฎหมาย <span style={{color:"#e53935"}}>*</span></label>
        <div style={{border: errors.bases ? "1px solid #e53935" : "0.5px solid #e0e0e0", borderRadius:8, padding:"0.75rem 1rem"}}>
          {BASES.map(b => <Checkbox key={b.key} label={b.label} checked={bases.includes(b.key)} onChange={() => toggle(b.key)} />)}
        </div>
        {errors.bases && <div style={{fontSize:12, color:"#e53935", marginTop:4}}>{errors.bases}</div>}
      </div>
      <div style={G.row}>
        <label style={G.label}>รายละเอียดเพิ่มเติม</label>
        <textarea style={G.textarea} value={detail} onChange={e => setDetail(e.target.value)} placeholder="อธิบายรายละเอียดฐานกฎหมาย" />
      </div>
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}
