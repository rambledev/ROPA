"use client"
import { useState } from "react"
import { G, Checkbox, type SectionProps } from "./shared"
const METHODS = [
  { key:"delete_system",    label:"ลบออกจากระบบสารสนเทศ" },
  { key:"destroy_document", label:"ทำลายเอกสาร" },
  { key:"destroy_media",    label:"ทำลายสื่อบันทึก" },
  { key:"other",            label:"อื่น ๆ" },
]
export default function Section10({ data, onSave, onNext, onPrev }: SectionProps) {
  const [period, setPeriod] = useState(data.retentionPeriod as string ?? "")
  const [reference, setReference] = useState(data.legalReference as string ?? "")
  const [methods, setMethods] = useState<string[]>(data.destructionMethods as string[] ?? [])
  const [otherText, setOtherText] = useState(data.destructionOther as string ?? "")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const toggle = (k: string) => {
    setMethods(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k])
    if (errors.methods) setErrors(p => ({ ...p, methods: "" }))
  }
  const handleNext = () => {
    const e: Record<string, string> = {}
    if (!period.trim()) e.period = "กรุณาระบุระยะเวลาเก็บรักษา"
    if (methods.length === 0) e.methods = "กรุณาเลือกวิธีทำลายข้อมูลอย่างน้อย 1 วิธี"
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onSave({ retentionPeriod: period, legalReference: reference, destructionMethods: methods, destructionOther: otherText }); onNext?.()
  }
  return (
    <div>
      <div style={G.title}>ส่วนที่ 10 ระยะเวลาในการเก็บรักษาข้อมูลส่วนบุคคล</div>
      <div style={G.row}>
        <label style={G.label}>ระยะเวลาเก็บรักษา <span style={{color:"#e53935"}}>*</span></label>
        <input style={{...G.input, border: errors.period ? "1px solid #e53935" : G.input.border}}
          value={period} onChange={e => { setPeriod(e.target.value); if(errors.period) setErrors(p=>({...p,period:""})) }}
          placeholder="เช่น 5 ปี นับจากวันที่สิ้นสุดความสัมพันธ์" />
        {errors.period && <div style={{fontSize:12, color:"#e53935", marginTop:4}}>{errors.period}</div>}
      </div>
      <div style={G.row}>
        <label style={G.label}>อ้างอิงกฎหมาย/ระเบียบ</label>
        <input style={G.input} value={reference} onChange={e => setReference(e.target.value)} placeholder="เช่น พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 มาตรา..." />
      </div>
      <div style={G.row}>
        <label style={G.label}>วิธีการทำลายข้อมูล <span style={{color:"#e53935"}}>*</span></label>
        <div style={{border: errors.methods ? "1px solid #e53935" : "0.5px solid #e0e0e0", borderRadius:8, padding:"0.75rem 1rem"}}>
          {METHODS.map(m => <Checkbox key={m.key} label={m.label} checked={methods.includes(m.key)} onChange={() => toggle(m.key)} />)}
        </div>
        {errors.methods && <div style={{fontSize:12, color:"#e53935", marginTop:4}}>{errors.methods}</div>}
        {methods.includes("other") && (
          <input style={{...G.input, marginTop:8}} value={otherText} onChange={e => setOtherText(e.target.value)} placeholder="ระบุวิธีอื่น ๆ" />
        )}
      </div>
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}
