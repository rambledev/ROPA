"use client"
import { useState } from "react"
import { G, Checkbox, type SectionProps } from "./shared"
const SYSTEMS = [{key:"student_registry",label:"ระบบทะเบียนนักศึกษา"},{key:"hr_system",label:"ระบบบุคลากร"},{key:"e_document",label:"ระบบสารบรรณอิเล็กทรอนิกส์"},{key:"lms",label:"ระบบ LMS"},{key:"erp",label:"ระบบ ERP"},{key:"website",label:"ระบบเว็บไซต์"},{key:"cloud",label:"ระบบ Cloud"},{key:"ai",label:"ระบบ AI"},{key:"other",label:"อื่น ๆ"}]
export default function Section9({ data, onSave, onNext, onPrev }: SectionProps) {
  const [systems, setSystems] = useState<string[]>(data.systems as string[] ?? [])
  const [otherText, setOtherText] = useState(data.systemOther as string ?? "")
  const toggle = (k: string) => setSystems(p => p.includes(k) ? p.filter(x=>x!==k) : [...p,k])
  const handleNext = () => { onSave({ systems, systemOther:otherText }); onNext?.() }
  return (
    <div>
      <div style={G.title}>ส่วนที่ 9 ระบบสารสนเทศที่เกี่ยวข้อง</div>
      <div style={G.row}>
        <label style={G.label}>ระบบสารสนเทศที่ใช้</label>
        <div style={{border:"0.5px solid #e0e0e0",borderRadius:8,padding:"0.75rem 1rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem"}}>
          {SYSTEMS.map(s => <Checkbox key={s.key} label={s.label} checked={systems.includes(s.key)} onChange={()=>toggle(s.key)} />)}
        </div>
        {systems.includes("other") && <input style={{...G.input,marginTop:8}} value={otherText} onChange={e=>setOtherText(e.target.value)} placeholder="ระบุระบบอื่น ๆ" />}
      </div>
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}