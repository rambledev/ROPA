"use client"
import { useState } from "react"
import { G, type SectionProps } from "./shared"
const RISK_LEVELS = [
  { key:"low",       label:"ต่ำ",      color:"#2e7d32" },
  { key:"medium",    label:"ปานกลาง", color:"#e65100" },
  { key:"high",      label:"สูง",      color:"#c62828" },
  { key:"very_high", label:"สูงมาก",  color:"#b71c1c" },
]
export default function Section12({ data, onSave, onNext, onPrev }: SectionProps) {
  const [riskLevel, setRiskLevel] = useState(data.riskLevel as string ?? "")
  const [requiresDpia, setRequiresDpia] = useState<boolean>(data.requiresDpia as boolean ?? false)
  const [dpiaDetail, setDpiaDetail] = useState(data.dpiaDetail as string ?? "")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const handleNext = () => {
    if (!riskLevel) { setErrors({ riskLevel: "กรุณาเลือกระดับความเสี่ยง" }); return }
    onSave({ riskLevel, requiresDpia, dpiaDetail }); onNext?.()
  }
  return (
    <div>
      <div style={G.title}>ส่วนที่ 12 การประเมินความเสี่ยง</div>
      <div style={G.row}>
        <label style={G.label}>ระดับความเสี่ยง <span style={{color:"#e53935"}}>*</span></label>
        <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
          {RISK_LEVELS.map(r => (
            <label key={r.key} style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:14,
              background: riskLevel===r.key ? r.color+"22" : "#f9f9f9",
              border: riskLevel===r.key ? `2px solid ${r.color}` : "0.5px solid #e0e0e0",
              borderRadius:8, padding:"8px 16px", color: riskLevel===r.key ? r.color : "#444"}}>
              <input type="radio" checked={riskLevel===r.key} onChange={() => { setRiskLevel(r.key); setErrors({}) }}
                style={{accentColor:r.color}} />
              {r.label}
            </label>
          ))}
        </div>
        {errors.riskLevel && <div style={{fontSize:12, color:"#e53935", marginTop:4}}>{errors.riskLevel}</div>}
      </div>
      <div style={G.row}>
        <label style={G.label}>ต้องทำ DPIA หรือไม่</label>
        <div style={{display:"flex", gap:20}}>
          <label style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:14}}>
            <input type="radio" checked={requiresDpia===true} onChange={() => setRequiresDpia(true)} style={{accentColor:"#2e7d32"}} /> ต้องทำ DPIA
          </label>
          <label style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:14}}>
            <input type="radio" checked={requiresDpia===false} onChange={() => setRequiresDpia(false)} style={{accentColor:"#2e7d32"}} /> ไม่ต้องทำ
          </label>
        </div>
      </div>
      {requiresDpia && (
        <div style={G.row}>
          <label style={G.label}>รายละเอียด DPIA</label>
          <textarea style={G.textarea} value={dpiaDetail} onChange={e => setDpiaDetail(e.target.value)} placeholder="ระบุรายละเอียดการทำ DPIA" />
        </div>
      )}
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}
