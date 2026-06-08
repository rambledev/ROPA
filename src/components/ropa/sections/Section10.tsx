"use client"
import { useState } from "react"
import { G, Checkbox, type SectionProps } from "./shared"
const METHODS = [{key:"delete_system",label:"ลบจากระบบ"},{key:"destroy_document",label:"ทำลายเอกสาร"},{key:"destroy_media",label:"ทำลายสื่อบันทึกข้อมูล"},{key:"other",label:"อื่น ๆ"}]
export default function Section10({ data, onSave, onNext, onPrev }: SectionProps) {
  const [period, setPeriod] = useState(data.retentionPeriod as string ?? "")
  const [legal, setLegal] = useState(data.legalReference as string ?? "")
  const [methods, setMethods] = useState<string[]>(data.destructionMethods as string[] ?? [])
  const [otherText, setOtherText] = useState(data.destructionOther as string ?? "")
  const toggle = (k: string) => setMethods(p => p.includes(k) ? p.filter(x=>x!==k) : [...p,k])
  const handleNext = () => { onSave({ retentionPeriod:period, legalReference:legal, destructionMethods:methods, destructionOther:otherText }); onNext?.() }
  return (
    <div>
      <div style={G.title}>ส่วนที่ 10 ระยะเวลาการเก็บรักษาข้อมูล</div>
      <div style={G.row}><label style={G.label}>ระยะเวลาการเก็บรักษา <span style={{color:"#e53935"}}>*</span></label><input style={G.input} value={period} onChange={e=>setPeriod(e.target.value)} placeholder="เช่น 5 ปี นับจากวันที่สิ้นสุดการศึกษา" /></div>
      <div style={G.row}><label style={G.label}>เหตุผลทางกฎหมาย/ระเบียบที่เกี่ยวข้อง</label><textarea style={G.textarea} value={legal} onChange={e=>setLegal(e.target.value)} placeholder="ระบุกฎหมายหรือระเบียบที่เกี่ยวข้อง" /></div>
      <div style={G.row}>
        <label style={G.label}>วิธีการทำลายข้อมูลเมื่อครบกำหนด <span style={{color:"#e53935"}}>*</span></label>
        <div style={{border:"0.5px solid #e0e0e0",borderRadius:8,padding:"0.75rem 1rem"}}>
          {METHODS.map(m => <Checkbox key={m.key} label={m.label} checked={methods.includes(m.key)} onChange={()=>toggle(m.key)} />)}
        </div>
        {methods.includes("other") && <input style={{...G.input,marginTop:8}} value={otherText} onChange={e=>setOtherText(e.target.value)} placeholder="ระบุวิธีอื่น ๆ" />}
      </div>
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}