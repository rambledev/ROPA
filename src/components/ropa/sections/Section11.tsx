"use client"
import { useState } from "react"
import { G, Checkbox, type SectionProps } from "./shared"
const TECH = [{key:"access_control",label:"กำหนดสิทธิ์การเข้าถึง"},{key:"mfa",label:"การยืนยันตัวตนหลายปัจจัย (MFA)"},{key:"encryption",label:"การเข้ารหัสข้อมูล"},{key:"firewall",label:"Firewall"},{key:"antivirus",label:"Antivirus"},{key:"backup",label:"Backup"},{key:"log_monitoring",label:"Log Monitoring"}]
const ADMIN = [{key:"pdpa_policy",label:"นโยบาย PDPA"},{key:"staff_training",label:"อบรมบุคลากร"},{key:"nda",label:"ข้อตกลงรักษาความลับ (NDA)"},{key:"risk_management",label:"การบริหารความเสี่ยง"}]
export default function Section11({ data, onSave, onNext, onPrev }: SectionProps) {
  const [tech, setTech] = useState<string[]>(data.technicalMeasures as string[] ?? [])
  const [admin, setAdmin] = useState<string[]>(data.adminMeasures as string[] ?? [])
  const toggleT = (k: string) => setTech(p => p.includes(k) ? p.filter(x=>x!==k) : [...p,k])
  const toggleA = (k: string) => setAdmin(p => p.includes(k) ? p.filter(x=>x!==k) : [...p,k])
  const handleNext = () => { onSave({ technicalMeasures:tech, adminMeasures:admin }); onNext?.() }
  return (
    <div>
      <div style={G.title}>ส่วนที่ 11 มาตรการรักษาความมั่นคงปลอดภัย</div>
      <div style={G.row}>
        <label style={G.label}>ด้านเทคนิค</label>
        <div style={{border:"0.5px solid #e0e0e0",borderRadius:8,padding:"0.75rem 1rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem"}}>
          {TECH.map(t => <Checkbox key={t.key} label={t.label} checked={tech.includes(t.key)} onChange={()=>toggleT(t.key)} />)}
        </div>
      </div>
      <div style={G.row}>
        <label style={G.label}>ด้านการบริหารจัดการ</label>
        <div style={{border:"0.5px solid #e0e0e0",borderRadius:8,padding:"0.75rem 1rem"}}>
          {ADMIN.map(a => <Checkbox key={a.key} label={a.label} checked={admin.includes(a.key)} onChange={()=>toggleA(a.key)} />)}
        </div>
      </div>
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}