"use client"
import { useState } from "react"
import { G, type SectionProps } from "./shared"
const RISKS = [{key:"low",label:"ต่ำ",color:"#2e7d32",bg:"#e8f5e9"},{key:"medium",label:"ปานกลาง",color:"#e65100",bg:"#fff3e0"},{key:"high",label:"สูง",color:"#c62828",bg:"#ffebee"},{key:"very_high",label:"สูงมาก",color:"#b71c1c",bg:"#ffcdd2"}]
export default function Section12({ data, onSave, onNext, onPrev }: SectionProps) {
  const [risk, setRisk] = useState(data.riskLevel as string ?? "")
  const [dpia, setDpia] = useState(data.requiresDpia as boolean ?? false)
  const [detail, setDetail] = useState(data.dpiaDetail as string ?? "")
  const handleNext = () => { onSave({ riskLevel:risk, requiresDpia:dpia, dpiaDetail:detail }); onNext?.() }
  return (
    <div>
      <div style={G.title}>ส่วนที่ 12 การประเมินความเสี่ยง</div>
      <div style={G.row}>
        <label style={G.label}>ระดับความเสี่ยง <span style={{color:"#e53935"}}>*</span></label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {RISKS.map(r => (
            <div key={r.key} onClick={()=>setRisk(r.key)} style={{border:risk===r.key?"2px solid "+r.color:"0.5px solid #e0e0e0",borderRadius:8,padding:"12px 16px",cursor:"pointer",background:risk===r.key?r.bg:"#fff",textAlign:"center",fontWeight:risk===r.key?600:400,color:risk===r.key?r.color:"#666",fontSize:14}}>
              {r.label}
            </div>
          ))}
        </div>
      </div>
      <div style={G.row}>
        <label style={G.label}>ต้องดำเนินการ DPIA หรือไม่</label>
        <div style={{border:"0.5px solid #e0e0e0",borderRadius:8,padding:"0.75rem 1rem",display:"flex",gap:24}}>
          <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:14}}><input type="radio" name="dpia" checked={dpia} onChange={()=>setDpia(true)} style={{accentColor:"#2e7d32"}} /> ใช่</label>
          <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:14}}><input type="radio" name="dpia" checked={!dpia} onChange={()=>setDpia(false)} style={{accentColor:"#2e7d32"}} /> ไม่ใช่</label>
        </div>
      </div>
      {dpia && <div style={G.row}><label style={G.label}>รายละเอียด DPIA</label><textarea style={G.textarea} value={detail} onChange={e=>setDetail(e.target.value)} placeholder="ระบุรายละเอียดการประเมิน DPIA" /></div>}
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}