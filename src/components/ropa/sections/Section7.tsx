"use client"
import { useState } from "react"
import { G, type SectionProps } from "./shared"
export default function Section7({ data, onSave, onNext, onPrev }: SectionProps) {
  const [internal, setInternal] = useState(data.internalRecipients as string ?? "")
  const [external, setExternal] = useState(data.externalRecipients as string ?? "")
  const [reason, setReason] = useState(data.disclosureReason as string ?? "")
  const handleNext = () => { onSave({ internalRecipients:internal, externalRecipients:external, disclosureReason:reason }); onNext?.() }
  return (
    <div>
      <div style={G.title}>ส่วนที่ 7 ผู้รับข้อมูลส่วนบุคคล</div>
      <div style={G.row}><label style={G.label}>หน่วยงานภายในมหาวิทยาลัย</label><textarea style={G.textarea} value={internal} onChange={e=>setInternal(e.target.value)} placeholder="ระบุหน่วยงานภายในที่รับข้อมูล" /></div>
      <div style={G.row}><label style={G.label}>หน่วยงานภายนอก</label><textarea style={G.textarea} value={external} onChange={e=>setExternal(e.target.value)} placeholder="ระบุหน่วยงานภายนอกที่รับข้อมูล" /></div>
      <div style={G.row}><label style={G.label}>เหตุผลในการเปิดเผยข้อมูล</label><textarea style={G.textarea} value={reason} onChange={e=>setReason(e.target.value)} placeholder="ระบุเหตุผล" /></div>
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}