"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { adminApi } from "@/lib/api/admin"
import Link from "next/link"

type Section = { sectionNumber: number; data: Record<string, unknown>; updatedAt: string }
type Approval = { approverRole: string; status: string; comment: string | null; signedAt: string | null; approver: { firstName: string; lastName: string } }
type RopaDetail = {
  id: string; ropaId: string; title: string; status: string; version: number
  ownerPosition: string | null; ownerPhone: string | null; ownerEmail: string | null
  submittedAt: string | null; createdAt: string; updatedAt: string
  owner: { firstName: string; lastName: string; email: string }
  department: { name: string; code: string }
  sections: Section[]
  approvals: Approval[]
}

const STATUS = {
  draft:     { label: "ร่าง",       color: "#666",    bg: "#f5f5f5" },
  submitted: { label: "รออนุมัติ", color: "#1565c0", bg: "#e3f2fd" },
  approved:  { label: "อนุมัติ",   color: "#2e7d32", bg: "#e8f5e9" },
  rejected:  { label: "ปฏิเสธ",   color: "#e53935", bg: "#ffebee" },
  revision:  { label: "แก้ไข",    color: "#e65100", bg: "#fff3e0" },
} as Record<string, { label: string; color: string; bg: string }>

const SECTION_LABELS: Record<number, string> = {
  1: "ข้อมูลทั่วไป", 2: "รายละเอียดกิจกรรม", 3: "เจ้าของข้อมูล",
  4: "ประเภทข้อมูล", 5: "ฐานกฎหมาย", 6: "แหล่งที่มา",
  7: "ผู้รับข้อมูล", 8: "โอนข้อมูลต่างประเทศ", 9: "ระบบสารสนเทศ",
  10: "ระยะเวลาเก็บรักษา", 11: "มาตรการความปลอดภัย",
  12: "ประเมินความเสี่ยง", 13: "การรับรอง",
}

const PURPOSES: Record<string, string> = {
  education:"การจัดการศึกษา", hr:"การบริหารงานบุคคล", research:"การวิจัย",
  academic_service:"การบริการวิชาการ", internal_management:"การบริหารจัดการภายใน", other:"อื่น ๆ"
}
const SUBJECTS: Record<string, string> = {
  student:"นักศึกษา", applicant:"ผู้สมัครเรียน", alumni:"ศิษย์เก่า", staff:"บุคลากร",
  employee:"ลูกจ้าง", contractor:"ผู้รับจ้าง", researcher:"นักวิจัย",
  research_volunteer:"อาสาสมัครวิจัย", trainee:"ผู้เข้ารับการอบรม",
  visitor:"ผู้มาติดต่อราชการ", it_user:"ผู้ใช้บริการระบบสารสนเทศ", other:"อื่น ๆ"
}
const GENERAL_DATA: Record<string, string> = {
  name:"ชื่อ-สกุล", id_card:"เลขประจำตัวประชาชน", birthdate:"วันเดือนปีเกิด",
  gender:"เพศ", address:"ที่อยู่", phone:"หมายเลขโทรศัพท์", email:"อีเมล",
  photo:"ภาพถ่าย", education:"ประวัติการศึกษา", work:"ข้อมูลการทำงาน",
  financial:"ข้อมูลทางการเงิน", other:"อื่น ๆ"
}
const SENSITIVE_DATA: Record<string, string> = {
  race:"เชื้อชาติ", religion:"ศาสนา", health:"ข้อมูลสุขภาพ",
  biometric:"ข้อมูลชีวภาพ (Biometric)", criminal:"ประวัติอาชญากรรม",
  disability:"ความพิการ", none:"ไม่มี", other:"อื่น ๆ"
}
const LEGAL_BASES: Record<string, string> = {
  legal_obligation:"การปฏิบัติหน้าที่ตามกฎหมาย", public_task:"การปฏิบัติภารกิจสาธารณะ",
  contract:"การปฏิบัติตามสัญญา", consent:"ความยินยอม",
  legitimate_interest:"ประโยชน์โดยชอบด้วยกฎหมาย", vital_interest:"การป้องกันอันตรายต่อชีวิต",
  historical_research:"การจัดทำเอกสารประวัติศาสตร์/วิจัย"
}
const SYSTEMS: Record<string, string> = {
  student_registry:"ระบบทะเบียนนักศึกษา", hr_system:"ระบบบุคลากร",
  e_document:"ระบบสารบรรณอิเล็กทรอนิกส์", lms:"ระบบ LMS", erp:"ระบบ ERP",
  website:"ระบบเว็บไซต์", cloud:"ระบบ Cloud", ai:"ระบบ AI", other:"อื่น ๆ"
}
const TECH: Record<string, string> = {
  access_control:"กำหนดสิทธิ์การเข้าถึง", mfa:"MFA", encryption:"การเข้ารหัส",
  firewall:"Firewall", antivirus:"Antivirus", backup:"Backup", log_monitoring:"Log Monitoring"
}
const ADMIN_MEASURES: Record<string, string> = {
  pdpa_policy:"นโยบาย PDPA", staff_training:"อบรมบุคลากร",
  nda:"NDA", risk_management:"การบริหารความเสี่ยง"
}
const RISK: Record<string, { label: string; color: string }> = {
  low:      { label: "ต่ำ",      color: "#2e7d32" },
  medium:   { label: "ปานกลาง", color: "#e65100" },
  high:     { label: "สูง",      color: "#c62828" },
  very_high:{ label: "สูงมาก",  color: "#b71c1c" },
}

const Tag = ({ label }: { label: string }) => (
  <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "3px 10px", borderRadius: 20, fontSize: 12, margin: "2px" }}>{label}</span>
)

const SectionCard = ({ section }: { section: Section }) => {
  const d = section.data
  const no = section.sectionNumber

  const renderContent = () => {
    if (no === 2) return (
      <div>
        <div style={rowStyle}><span style={labelStyle}>รายละเอียดกิจกรรม:</span><span>{d.activityDetail as string}</span></div>
        <div style={rowStyle}><span style={labelStyle}>วัตถุประสงค์:</span><div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>{(d.purposes as string[] ?? []).map(p => <Tag key={p} label={PURPOSES[p] ?? p} />)}</div></div>
        {!!d.purposeDetail && <div style={rowStyle}><span style={labelStyle}>รายละเอียด:</span><span>{String(d.purposeDetail)}</span></div>}
      </div>
    )
    if (no === 3) return (
      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
        {(d.dataSubjects as string[] ?? []).map(s => <Tag key={s} label={SUBJECTS[s] ?? s} />)}
      </div>
    )
    if (no === 4) return (
      <div>
        <div style={rowStyle}><span style={labelStyle}>ข้อมูลทั่วไป:</span><div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>{(d.generalData as string[] ?? []).map(g => <Tag key={g} label={GENERAL_DATA[g] ?? g} />)}</div></div>
        <div style={rowStyle}><span style={labelStyle}>ข้อมูลอ่อนไหว:</span><div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>{(d.sensitiveData as string[] ?? []).map(s => <span key={s} style={{background:(d.sensitiveData as string[]).includes("none")?"#f5f5f5":"#ffebee",color:(d.sensitiveData as string[]).includes("none")?"#666":"#e53935",padding:"3px 10px",borderRadius:20,fontSize:12,margin:"2px"}}>{SENSITIVE_DATA[s] ?? s}</span>)}</div></div>
      </div>
    )
    if (no === 5) return (
      <div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>{(d.legalBases as string[] ?? []).map(b => <Tag key={b} label={LEGAL_BASES[b] ?? b} />)}</div>
        {!!d.legalBasisDetail && <div style={{fontSize:13,color:"#666"}}>{String(d.legalBasisDetail)}</div>}
      </div>
    )
    if (no === 6) return <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{(d.sources as string[] ?? []).map(s => <Tag key={s} label={s} />)}</div>
    if (no === 7) return (
      <div>
        {!!d.internalRecipients && <div style={rowStyle}><span style={labelStyle}>ภายใน:</span><span>{String(d.internalRecipients)}</span></div>}
        {!!d.externalRecipients && <div style={rowStyle}><span style={labelStyle}>ภายนอก:</span><span>{String(d.externalRecipients)}</span></div>}
        {!!d.disclosureReason && <div style={rowStyle}><span style={labelStyle}>เหตุผล:</span><span>{String(d.disclosureReason)}</span></div>}
      </div>
    )
    if (no === 8) return (
      <div>
        <div style={rowStyle}><span style={labelStyle}>โอนต่างประเทศ:</span><span style={{color:d.hasTransfer?"#e53935":"#2e7d32"}}>{d.hasTransfer ? "มี" : "ไม่มี"}</span></div>
        {!!d.hasTransfer && <><div style={rowStyle}><span style={labelStyle}>ประเทศปลายทาง:</span><span>{String(d.destinationCountry)}</span></div><div style={rowStyle}><span style={labelStyle}>มาตรการ:</span><span>{String(d.safeguardMeasures)}</span></div></>}
      </div>
    )
    if (no === 9) return <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{(d.systems as string[] ?? []).map(s => <Tag key={s} label={SYSTEMS[s] ?? s} />)}</div>
    if (no === 10) return (
      <div>
        <div style={rowStyle}><span style={labelStyle}>ระยะเวลา:</span><span>{d.retentionPeriod as string}</span></div>
        {!!d.legalReference && <div style={rowStyle}><span style={labelStyle}>อ้างอิง:</span><span>{String(d.legalReference)}</span></div>}
      </div>
    )
    if (no === 11) return (
      <div>
        <div style={rowStyle}><span style={labelStyle}>ด้านเทคนิค:</span><div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>{(d.technicalMeasures as string[] ?? []).map(t => <Tag key={t} label={TECH[t] ?? t} />)}</div></div>
        <div style={rowStyle}><span style={labelStyle}>ด้านบริหาร:</span><div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>{(d.adminMeasures as string[] ?? []).map(a => <Tag key={a} label={ADMIN_MEASURES[a] ?? a} />)}</div></div>
      </div>
    )
    if (no === 12) {
      const r = RISK[d.riskLevel as string]
      return (
        <div>
          <div style={rowStyle}><span style={labelStyle}>ระดับความเสี่ยง:</span><span style={{color:r?.color,fontWeight:600}}>{r?.label ?? d.riskLevel as string}</span></div>
          <div style={rowStyle}><span style={labelStyle}>ต้อง DPIA:</span><span>{d.requiresDpia ? "ใช่" : "ไม่ใช่"}</span></div>
          {!!d.dpiaDetail && <div style={rowStyle}><span style={labelStyle}>รายละเอียด:</span><span>{String(d.dpiaDetail)}</span></div>}
        </div>
      )
    }
    if (no === 13) return (
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        <div style={{border:"0.5px solid #e0e0e0",borderRadius:8,padding:"0.75rem",textAlign:"center"}}>
          <div style={{fontSize:12,color:"#2e7d32",fontWeight:500,marginBottom:8}}>ผู้จัดทำ</div>
          <div style={{fontSize:13}}>{d.makerName as string}</div>
          <div style={{fontSize:12,color:"#666"}}>{d.makerPosition as string}</div>
          <div style={{fontSize:12,color:"#999",marginTop:4}}>{d.makerDate as string}</div>
        </div>
        <div style={{border:"0.5px solid #e0e0e0",borderRadius:8,padding:"0.75rem",textAlign:"center"}}>
          <div style={{fontSize:12,color:"#2e7d32",fontWeight:500,marginBottom:8}}>ผู้บังคับบัญชา</div>
          <div style={{fontSize:13}}>{d.supervisorName as string}</div>
          <div style={{fontSize:12,color:"#666"}}>{d.supervisorPosition as string}</div>
          <div style={{fontSize:12,color:"#999",marginTop:4}}>{d.supervisorDate as string}</div>
        </div>
        <div style={{border:"0.5px solid #e0e0e0",borderRadius:8,padding:"0.75rem",textAlign:"center"}}>
          <div style={{fontSize:12,color:"#2e7d32",fontWeight:500,marginBottom:8}}>DPO</div>
          <div style={{fontSize:13}}>{d.dpoName as string}</div>
          <div style={{fontSize:12,color:"#999",marginTop:4}}>{d.dpoDate as string}</div>
        </div>
      </div>
    )
    return <pre style={{fontSize:12,color:"#666",overflow:"auto"}}>{JSON.stringify(d, null, 2)}</pre>
  }

  return (
    <div style={{border:"0.5px solid #e0e0e0",borderRadius:10,marginBottom:"0.75rem",overflow:"hidden"}}>
      <div style={{background:"#f9fafb",padding:"10px 16px",display:"flex",alignItems:"center",gap:8,borderBottom:"0.5px solid #e0e0e0"}}>
        <span style={{width:24,height:24,background:"#2e7d32",color:"#fff",borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,flexShrink:0}}>{no}</span>
        <span style={{fontSize:14,fontWeight:500,color:"#1a1a1a"}}>{SECTION_LABELS[no]}</span>
        <span style={{marginLeft:"auto",fontSize:12,color:"#999"}}>{new Date(section.updatedAt).toLocaleDateString("th-TH")}</span>
      </div>
      <div style={{padding:"1rem"}}>{renderContent()}</div>
    </div>
  )
}

const rowStyle: React.CSSProperties = { display:"flex", gap:8, marginBottom:6, fontSize:13, alignItems:"flex-start" }
const labelStyle: React.CSSProperties = { color:"#666", flexShrink:0, minWidth:120 }

export default function RopaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [ropa, setRopa] = useState<RopaDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      adminApi.getRopaDetail(params.id as string)
        .then(setRopa)
        .catch(() => router.push("/admin/ropa"))
        .finally(() => setLoading(false))
    }
  }, [params.id, router])

  if (loading) return <div style={{textAlign:"center",padding:"3rem",color:"#666",fontSize:14}}>กำลังโหลด...</div>
  if (!ropa) return null

  const s = STATUS[ropa.status] ?? STATUS.draft
  const sortedSections = [...ropa.sections].sort((a, b) => a.sectionNumber - b.sectionNumber)

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:"#666",marginBottom:"1.25rem"}}>
        <Link href="/admin" style={{color:"#2e7d32",textDecoration:"none"}}>Dashboard</Link>
        <span>›</span>
        <Link href="/admin/ropa" style={{color:"#2e7d32",textDecoration:"none"}}>รายการ ROPA</Link>
        <span>›</span>
        <span>{ropa.ropaId}</span>
      </div>

      {/* Header */}
      <div style={{background:"#fff",borderRadius:10,border:"0.5px solid #e0e0e0",padding:"1.25rem 1.5rem",marginBottom:"1rem"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span style={{fontSize:18,fontWeight:700,color:"#2e7d32"}}>{ropa.ropaId}</span>
              <span style={{background:s.bg,color:s.color,padding:"3px 12px",borderRadius:20,fontSize:13}}>{s.label}</span>
              <span style={{fontSize:12,color:"#999"}}>v{ropa.version}</span>
            </div>
            <h1 style={{fontSize:16,fontWeight:500,color:"#1a1a1a",marginBottom:12}}>{ropa.title}</h1>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:8}}>
              <div style={{fontSize:13}}>
                <span style={{color:"#666"}}>หน่วยงาน: </span>
                <span style={{color:"#1a1a1a",fontWeight:500}}>{ropa.department?.name}</span>
              </div>
              <div style={{fontSize:13}}>
                <span style={{color:"#666"}}>ผู้รับผิดชอบ: </span>
                <span style={{color:"#1a1a1a"}}>{ropa.owner?.firstName} {ropa.owner?.lastName}</span>
              </div>
              {ropa.ownerEmail && <div style={{fontSize:13}}><span style={{color:"#666"}}>อีเมล: </span><span>{ropa.ownerEmail}</span></div>}
              {ropa.ownerPhone && <div style={{fontSize:13}}><span style={{color:"#666"}}>โทร: </span><span>{ropa.ownerPhone}</span></div>}
              <div style={{fontSize:13}}>
                <span style={{color:"#666"}}>วันที่สร้าง: </span>
                <span>{new Date(ropa.createdAt).toLocaleDateString("th-TH")}</span>
              </div>
              {ropa.submittedAt && <div style={{fontSize:13}}>
                <span style={{color:"#666"}}>วันที่ส่ง: </span>
                <span>{new Date(ropa.submittedAt).toLocaleDateString("th-TH")}</span>
              </div>}
            </div>
          </div>

          {/* Progress */}
          <div style={{background:"#f9fafb",borderRadius:8,padding:"0.75rem 1rem",textAlign:"center",minWidth:120}}>
            <div style={{fontSize:24,fontWeight:700,color:"#2e7d32"}}>{ropa.sections.length}<span style={{fontSize:14,color:"#999"}}>/13</span></div>
            <div style={{fontSize:12,color:"#666"}}>ส่วนที่กรอก</div>
            <div style={{height:4,background:"#e0e0e0",borderRadius:2,marginTop:8,overflow:"hidden"}}>
              <div style={{height:"100%",background:"#2e7d32",borderRadius:2,width:`${(ropa.sections.length/13)*100}%`}} />
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div style={{marginBottom:"1rem"}}>
        <h2 style={{fontSize:15,fontWeight:500,color:"#1a1a1a",marginBottom:"0.75rem"}}>รายละเอียดแบบฟอร์ม</h2>
        {sortedSections.length === 0 ? (
          <div style={{background:"#fff",borderRadius:10,border:"0.5px solid #e0e0e0",padding:"2rem",textAlign:"center",color:"#999",fontSize:14}}>ยังไม่มีข้อมูล</div>
        ) : sortedSections.map(s => <SectionCard key={s.sectionNumber} section={s} />)}
      </div>

      {/* Approvals */}
      {ropa.approvals.length > 0 && (
        <div style={{background:"#fff",borderRadius:10,border:"0.5px solid #e0e0e0",padding:"1.25rem 1.5rem"}}>
          <h2 style={{fontSize:15,fontWeight:500,color:"#1a1a1a",marginBottom:"0.75rem"}}>ประวัติการอนุมัติ</h2>
          {ropa.approvals.map((a, i) => {
            const as = a.status === "approved" ? {color:"#2e7d32",bg:"#e8f5e9",label:"อนุมัติ"} : a.status === "rejected" ? {color:"#e53935",bg:"#ffebee",label:"ปฏิเสธ"} : {color:"#666",bg:"#f5f5f5",label:"รอดำเนินการ"}
            return (
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"10px 0",borderBottom:"0.5px solid #f0f0f0"}}>
                <span style={{background:as.bg,color:as.color,padding:"3px 10px",borderRadius:20,fontSize:12,flexShrink:0}}>{as.label}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500}}>{a.approver?.firstName} {a.approver?.lastName}</div>
                  <div style={{fontSize:12,color:"#666"}}>{a.approverRole}</div>
                  {a.comment && <div style={{fontSize:13,color:"#444",marginTop:4}}>{a.comment}</div>}
                </div>
                {a.signedAt && <div style={{fontSize:12,color:"#999",flexShrink:0}}>{new Date(a.signedAt).toLocaleDateString("th-TH")}</div>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
