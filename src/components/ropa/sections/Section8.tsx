"use client"
import { useState } from "react"
import { G, type SectionProps } from "./shared"
export default function Section8({ data, onSave, onNext, onPrev }: SectionProps) {
  const [hasTransfer, setHasTransfer] = useState<boolean>(data.hasTransfer as boolean ?? false)
  const [country, setCountry] = useState(data.destinationCountry as string ?? "")
  const [measures, setMeasures] = useState(data.safeguardMeasures as string ?? "")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const handleNext = () => {
    const e: Record<string, string> = {}
    if (hasTransfer && !country.trim()) e.country = "กรุณาระบุประเทศปลายทาง"
    if (hasTransfer && !measures.trim()) e.measures = "กรุณาระบุมาตรการคุ้มครอง"
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onSave({ hasTransfer, destinationCountry: country, safeguardMeasures: measures }); onNext?.()
  }
  return (
    <div>
      <div style={G.title}>ส่วนที่ 8 การโอนข้อมูลส่วนบุคคลไปต่างประเทศ</div>
      <div style={G.row}>
        <label style={G.label}>มีการโอนข้อมูลไปต่างประเทศหรือไม่ <span style={{color:"#e53935"}}>*</span></label>
        <div style={{display:"flex", gap:20}}>
          <label style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:14}}>
            <input type="radio" checked={hasTransfer===true} onChange={()=>setHasTransfer(true)} style={{accentColor:"#2e7d32"}} /> มี
          </label>
          <label style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:14}}>
            <input type="radio" checked={hasTransfer===false} onChange={()=>setHasTransfer(false)} style={{accentColor:"#2e7d32"}} /> ไม่มี
          </label>
        </div>
      </div>
      {hasTransfer && (
        <>
          <div style={G.row}>
            <label style={G.label}>ประเทศปลายทาง <span style={{color:"#e53935"}}>*</span></label>
            <input style={{...G.input, border: errors.country ? "1px solid #e53935" : G.input.border}}
              value={country} onChange={e => { setCountry(e.target.value); if(errors.country) setErrors(p=>({...p,country:""})) }}
              placeholder="ระบุประเทศปลายทาง" />
            {errors.country && <div style={{fontSize:12, color:"#e53935", marginTop:4}}>{errors.country}</div>}
          </div>
          <div style={G.row}>
            <label style={G.label}>มาตรการคุ้มครอง <span style={{color:"#e53935"}}>*</span></label>
            <textarea style={{...G.textarea, border: errors.measures ? "1px solid #e53935" : G.textarea.border}}
              value={measures} onChange={e => { setMeasures(e.target.value); if(errors.measures) setErrors(p=>({...p,measures:""})) }}
              placeholder="ระบุมาตรการคุ้มครองข้อมูล" />
            {errors.measures && <div style={{fontSize:12, color:"#e53935", marginTop:4}}>{errors.measures}</div>}
          </div>
        </>
      )}
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button style={G.btnPrimary} onClick={handleNext}>บันทึกและถัดไป →</button>
      </div>
    </div>
  )
}
