"use client"
import { useState } from "react"
import { G, type SectionProps } from "./shared"
export default function Section13({ data, onSave, onPrev }: SectionProps) {
  const [maker, setMaker] = useState({ name: data.makerName as string ?? "", position: data.makerPosition as string ?? "", date: data.makerDate as string ?? "" })
  const [supervisor, setSupervisor] = useState({ name: data.supervisorName as string ?? "", position: data.supervisorPosition as string ?? "", date: data.supervisorDate as string ?? "" })
  const [dpo, setDpo] = useState({ name: data.dpoName as string ?? "", date: data.dpoDate as string ?? "" })
  const [consent, setConsent] = useState(false)

  const handleSubmit = () => {
    const submitData = {
      makerName: maker.name, makerPosition: maker.position, makerDate: maker.date,
      supervisorName: supervisor.name, supervisorPosition: supervisor.position, supervisorDate: supervisor.date,
      dpoName: dpo.name, dpoDate: dpo.date
    }
    onSave(submitData)
  }

  const Box = ({ title, fields, vals, onChange }: { title: string; fields: {k:string;l:string;t?:string}[]; vals: Record<string,string>; onChange:(k:string,v:string)=>void }) => (
    <div style={{border:"0.5px solid #e0e0e0",borderRadius:8,padding:"1rem",flex:1,minWidth:200}}>
      <div style={{fontSize:14,fontWeight:500,color:"#2e7d32",marginBottom:12,textAlign:"center"}}>{title}</div>
      {fields.map(f => (
        <div key={f.k} style={{marginBottom:8}}>
          <label style={{...G.label,fontSize:12}}>{f.l}</label>
          <input style={{...G.input,fontSize:13}} type={f.t??"text"} value={vals[f.k]??""} onChange={e=>onChange(f.k,e.target.value)} />
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <div style={G.title}>ส่วนที่ 13 การรับรองข้อมูล</div>
      <div style={{display:"flex",gap:12,marginBottom:"1rem",flexWrap:"wrap"}}>
        <Box title="ผู้จัดทำ" fields={[{k:"name",l:"ชื่อ-สกุล"},{k:"position",l:"ตำแหน่ง"},{k:"date",l:"วันที่",t:"date"}]} vals={maker} onChange={(k,v)=>setMaker(p=>({...p,[k]:v}))} />
        <Box title="ผู้บังคับบัญชาหน่วยงาน" fields={[{k:"name",l:"ชื่อ-สกุล"},{k:"position",l:"ตำแหน่ง"},{k:"date",l:"วันที่",t:"date"}]} vals={supervisor} onChange={(k,v)=>setSupervisor(p=>({...p,[k]:v}))} />
        <Box title="เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO)" fields={[{k:"name",l:"ชื่อ-สกุล"},{k:"date",l:"วันที่",t:"date"}]} vals={dpo} onChange={(k,v)=>setDpo(p=>({...p,[k]:v}))} />
      </div>
      <div style={{background:"#f9fafb",border:"0.5px solid #e0e0e0",borderRadius:8,padding:"1rem",marginBottom:"1rem"}}>
        <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",fontSize:14}}>
          <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} style={{width:16,height:16,marginTop:2,accentColor:"#2e7d32",flexShrink:0}} />
          <span>ข้าพเจ้าขอรับรองว่าข้อมูลที่กรอกในแบบฟอร์มนี้ถูกต้องและครบถ้วน และยินยอมให้มหาวิทยาลัยราชภัฏมหาสารคามเก็บรักษาข้อมูลดังกล่าวตามนโยบาย PDPA</span>
        </label>
      </div>
      <div style={G.btnRow}>
        <button style={G.btnOutline} onClick={onPrev}>← ก่อนหน้า</button>
        <button
          style={{...G.btnPrimary, opacity: consent ? 1 : 0.5, cursor: consent ? "pointer" : "not-allowed"}}
          onClick={consent ? handleSubmit : undefined}
          disabled={!consent}>
          ส่งแบบฟอร์ม ✓
        </button>
      </div>
    </div>
  )
}