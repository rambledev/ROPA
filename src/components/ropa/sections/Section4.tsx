"use client"
import { useState } from "react"
import { G, Checkbox, type SectionProps } from "./shared"
const GENERAL = [{key:"name",label:"ชื่อ-สกุล"},{key:"id_card",label:"เลขประจำตัวประชาชน"},{key:"birthdate",label:"วันเดือนปีเกิด"},{key:"gender",label:"เพศ"},{key:"address",label:"ที่อยู่"},{key:"phone",label:"หมายเลขโทรศัพท์"},{key:"email",label:"อีเมล"},{key:"photo",label:"ภาพถ่าย"},{key:"education",label:"ประวัติการศึกษา"},{key:"work",label:"ข้อมูลการทำงาน"},{key:"financial",label:"ข้อมูลทางการเงิน"},{key:"other",label:"อื่น ๆ"}]
const SENSITIVE = [{key:"race",label:"เชื้อชาติ"},{key:"religion",label:"ศาสนา"},{key:"health",label:"ข้อมูลสุขภาพ"},{key:"biometric",label:"ข้อมูลชีวภาพ (Biometric)"},{key:"criminal",label:"ประวัติอาชญากรรม"},{key:"disability",label:"ความพิการ"},{key:"none",label:"ไม่มี"},{key:"other",label:"อื่น ๆ"}]
export default function Section4({ data, onSave, onNext, onPrev }: SectionProps) {
  const [general, setGeneral] = useState<string[]>(data.generalData as string[] ?? [])
  const [sensitive, setSensitive] = useState<string[]>(data.sensitiveData as string[] ?? [])
  const [genOther, setGenOther] = useState(data.generalDataOther as string ?? "")
  const [senOther, setSenOther] = useState(data.sensitiveDataOther as string ?? "")
  const toggleG = (k: string) => setGeneral(p => p.includes(k) ? p.filter(x=>x!==k) : [...p,k])
  const toggleS = (k: string) => setSensitive(p => p.includes(k) ? p.filter(x=>x!==k) : [...p,k])
  const handleNext = () => { onSave({ generalData:general, sensitiveData:sensitive, generalDataOther:genOther, sensitiveDataOther:senOther }); onNext?.() }
  return (
    <div>
      <div style={G.title}>ส่วนที่ 4 ประเภทข้อมูลส่วนบุคคล</div>
      <div style={G.row}>
        <label style={G.label}>4.1 ข้อมูลส่วนบุคคลทั่วไป</label>
        <div style={{border:"0.5px solid #e0e0e0",borderRadius:8,padding:"0.75rem 1rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem"}}>
          {GENERAL.map(g => <Checkbox key={g.key} label={g.label} checked={general.includes(g.key)} onChange={()=>toggleG(g.key)} />)}
        </div>
        {general.includes("other") && <input style={{...G.input,marginTop:8}} value={genOther} onChange={e=>setGenOther(e.target.value)} placeholder="ระบุข้อมูลอื่น ๆ" />}
      </div>
      <div style={G.row}>
        <label style={G.label}>4.2 ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)</label>
        <div style={{border:"0.5px solid #ffcdd2",borderRadius:8,padding:"0.75rem 1rem",background:"#fff8f8",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem"}}>
          {SENSITIVE.map(s => <Checkbox key={s.key} label={s.label} checked={sensitive.includes(s.key)} onChange={()=>toggleS(s.key)} />)}
        </div>
        {sensitive.includes("other") && <input style={{...G.input,marginTop:8}} value={senOther} onChange={e=>setSenOther(e.target.value)} placeholder="ระบุข้อมูลอื่น ๆ" />}
      </div>
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}