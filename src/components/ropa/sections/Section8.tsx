"use client"
import { useState } from "react"
import { G, type SectionProps } from "./shared"
export default function Section8({ data, onSave, onNext, onPrev }: SectionProps) {
  const [hasTransfer, setHasTransfer] = useState(data.hasTransfer as boolean ?? false)
  const [country, setCountry] = useState(data.destinationCountry as string ?? "")
  const [measures, setMeasures] = useState(data.safeguardMeasures as string ?? "")
  const handleNext = () => { onSave({ hasTransfer, destinationCountry:country, safeguardMeasures:measures }); onNext?.() }
  return (
    <div>
      <div style={G.title}>ส่วนที่ 8 การโอนข้อมูลไปต่างประเทศ</div>
      <div style={G.row}>
        <label style={G.label}>มีการโอนข้อมูลไปต่างประเทศหรือไม่</label>
        <div style={{border:"0.5px solid #e0e0e0",borderRadius:8,padding:"0.75rem 1rem",display:"flex",gap:24}}>
          <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:14}}><input type="radio" name="transfer" checked={!hasTransfer} onChange={()=>setHasTransfer(false)} style={{accentColor:"#2e7d32"}} /> ไม่มี</label>
          <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:14}}><input type="radio" name="transfer" checked={hasTransfer} onChange={()=>setHasTransfer(true)} style={{accentColor:"#2e7d32"}} /> มี</label>
        </div>
      </div>
      {hasTransfer && (<>
        <div style={G.row}><label style={G.label}>ประเทศปลายทาง</label><input style={G.input} value={country} onChange={e=>setCountry(e.target.value)} placeholder="ระบุประเทศปลายทาง" /></div>
        <div style={G.row}><label style={G.label}>มาตรการรองรับ</label><textarea style={G.textarea} value={measures} onChange={e=>setMeasures(e.target.value)} placeholder="ระบุมาตรการรองรับ" /></div>
      </>)}
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}