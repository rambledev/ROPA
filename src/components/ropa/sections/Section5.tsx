"use client"
import { useState } from "react"
import { G, Checkbox, type SectionProps } from "./shared"
const BASES = [{key:"legal_obligation",label:"การปฏิบัติหน้าที่ตามกฎหมาย (Legal Obligation)"},{key:"public_task",label:"การปฏิบัติภารกิจเพื่อประโยชน์สาธารณะ (Public Task)"},{key:"contract",label:"การปฏิบัติตามสัญญา (Contract)"},{key:"consent",label:"ความยินยอม (Consent)"},{key:"legitimate_interest",label:"ประโยชน์โดยชอบด้วยกฎหมาย (Legitimate Interest)"},{key:"vital_interest",label:"การป้องกันอันตรายต่อชีวิต (Vital Interest)"},{key:"historical_research",label:"การจัดทำเอกสารประวัติศาสตร์ วิจัย หรือสถิติ"}]
export default function Section5({ data, onSave, onNext, onPrev }: SectionProps) {
  const [bases, setBases] = useState<string[]>(data.legalBases as string[] ?? [])
  const [detail, setDetail] = useState(data.legalBasisDetail as string ?? "")
  const toggle = (k: string) => setBases(p => p.includes(k) ? p.filter(x=>x!==k) : [...p,k])
  const handleNext = () => { onSave({ legalBases:bases, legalBasisDetail:detail }); onNext?.() }
  return (
    <div>
      <div style={G.title}>ส่วนที่ 5 ฐานกฎหมายในการประมวลผลข้อมูล</div>
      <div style={G.row}>
        <label style={G.label}>ฐานกฎหมาย <span style={{color:"#e53935"}}>*</span></label>
        <div style={{border:"0.5px solid #e0e0e0",borderRadius:8,padding:"0.75rem 1rem"}}>
          {BASES.map(b => <Checkbox key={b.key} label={b.label} checked={bases.includes(b.key)} onChange={()=>toggle(b.key)} />)}
        </div>
      </div>
      <div style={G.row}>
        <label style={G.label}>รายละเอียดเพิ่มเติม</label>
        <textarea style={G.textarea} value={detail} onChange={e=>setDetail(e.target.value)} placeholder="ระบุรายละเอียดเพิ่มเติม" />
      </div>
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}