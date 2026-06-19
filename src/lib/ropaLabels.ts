export const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  draft:     { label: "ร่าง",       color: "#666",    bg: "#f5f5f5" },
  submitted: { label: "รออนุมัติ", color: "#1565c0", bg: "#e3f2fd" },
  approved:  { label: "อนุมัติ",   color: "#2e7d32", bg: "#e8f5e9" },
  rejected:  { label: "ปฏิเสธ",   color: "#e53935", bg: "#ffebee" },
  revision:  { label: "ต้องแก้ไข", color: "#e65100", bg: "#fff3e0" },
}

export const SECTION_LABELS: Record<number, string> = {
  1:"ข้อมูลทั่วไป", 2:"รายละเอียดกิจกรรม", 3:"เจ้าของข้อมูล",
  4:"ประเภทข้อมูล", 5:"ฐานกฎหมาย", 6:"แหล่งที่มา",
  7:"ผู้รับข้อมูล", 8:"โอนข้อมูลต่างประเทศ", 9:"ระบบสารสนเทศ",
  10:"ระยะเวลาเก็บรักษา", 11:"มาตรการความปลอดภัย",
  12:"ประเมินความเสี่ยง", 13:"การรับรอง",
}

export const FIELD_LABELS: Record<string, string> = {
  departmentName:"ชื่อหน่วยงาน", title:"ชื่อกิจกรรม", ropaId:"รหัส ROPA",
  ownerName:"ชื่อผู้รับผิดชอบ", ownerPosition:"ตำแหน่ง", ownerPhone:"โทรศัพท์",
  ownerEmail:"อีเมล", createdDate:"วันที่จัดทำ", updatedDate:"วันที่ปรับปรุง",
  activityDetail:"รายละเอียดกิจกรรม", purposes:"วัตถุประสงค์", purposeDetail:"วัตถุประสงค์โดยละเอียด",
  purposeOther:"วัตถุประสงค์อื่น ๆ",
  dataSubjects:"ประเภทเจ้าของข้อมูล", dataSubjectOther:"อื่น ๆ",
  generalData:"ข้อมูลทั่วไป", sensitiveData:"ข้อมูลอ่อนไหว",
  generalDataOther:"ข้อมูลทั่วไปอื่น ๆ", sensitiveDataOther:"ข้อมูลอ่อนไหวอื่น ๆ",
  legalBases:"ฐานกฎหมาย", legalBasisDetail:"รายละเอียดฐานกฎหมาย",
  sources:"แหล่งที่มา", sourceOther:"แหล่งที่มาอื่น ๆ",
  internalRecipients:"ผู้รับข้อมูลภายใน", externalRecipients:"ผู้รับข้อมูลภายนอก",
  disclosureReason:"เหตุผลในการเปิดเผย",
  hasTransfer:"มีการโอนต่างประเทศ", destinationCountry:"ประเทศปลายทาง",
  safeguardMeasures:"มาตรการคุ้มครอง",
  systems:"ระบบสารสนเทศ", systemOther:"ระบบอื่น ๆ",
  retentionPeriod:"ระยะเวลาเก็บรักษา", legalReference:"อ้างอิงกฎหมาย",
  destructionMethods:"วิธีทำลายข้อมูล", destructionOther:"วิธีอื่น ๆ",
  technicalMeasures:"มาตรการด้านเทคนิค", adminMeasures:"มาตรการด้านบริหาร",
  riskLevel:"ระดับความเสี่ยง", requiresDpia:"ต้องทำ DPIA", dpiaDetail:"รายละเอียด DPIA",
  makerName:"ชื่อผู้จัดทำ", makerPosition:"ตำแหน่งผู้จัดทำ", makerDate:"วันที่จัดทำ",
  supervisorName:"ชื่อผู้บังคับบัญชา", supervisorPosition:"ตำแหน่งผู้บังคับบัญชา",
  supervisorDate:"วันที่ลงนาม", dpoName:"ชื่อ DPO", dpoDate:"วันที่ DPO ลงนาม",
}

export const RISK_LABELS: Record<string, string> = {
  low:"ต่ำ", medium:"ปานกลาง", high:"สูง", very_high:"สูงมาก"
}

export const RISK_COLORS: Record<string, string> = {
  low:"#2e7d32", medium:"#e65100", high:"#c62828", very_high:"#b71c1c"
}

// แปลค่า enum (key ภาษาอังกฤษที่เก็บใน DB) ให้แสดงผลเป็นภาษาไทย
export const VALUE_LABELS: Record<string, string> = {
  education:"การจัดการศึกษา", hr:"การบริหารงานบุคคล", research:"การวิจัย",
  academic_service:"การบริการวิชาการ", internal_management:"การบริหารจัดการภายใน", other:"อื่น ๆ",
  student:"นักศึกษา", applicant:"ผู้สมัครเรียน", alumni:"ศิษย์เก่า", staff:"บุคลากร",
  employee:"ลูกจ้าง", contractor:"ผู้รับจ้าง", researcher:"นักวิจัย",
  research_volunteer:"อาสาสมัครวิจัย", trainee:"ผู้เข้ารับการอบรม", visitor:"ผู้มาติดต่อราชการ",
  it_user:"ผู้ใช้บริการระบบสารสนเทศ",
  name:"ชื่อ-สกุล", id_card:"เลขบัตรประชาชน", birthdate:"วันเดือนปีเกิด", gender:"เพศ",
  address:"ที่อยู่", phone:"โทรศัพท์", email:"อีเมล", photo:"รูปภาพ",
  education_data:"ข้อมูลการศึกษา", work:"ข้อมูลการทำงาน", financial:"ข้อมูลการเงิน",
  race:"เชื้อชาติ", religion:"ศาสนา", health:"สุขภาพ", biometric:"ข้อมูลชีวมาตร",
  criminal:"ประวัติอาชญากรรม", disability:"ความพิการ", none:"ไม่มี",
  legal_obligation:"การปฏิบัติหน้าที่ตามกฎหมาย", public_task:"การปฏิบัติภารกิจสาธารณะ",
  contract:"การปฏิบัติตามสัญญา", consent:"ความยินยอม", legitimate_interest:"ประโยชน์โดยชอบด้วยกฎหมาย",
  vital_interest:"การป้องกันอันตรายต่อชีวิต", historical_research:"การจัดทำเอกสารประวัติศาสตร์/วิจัย",
  data_subject:"เจ้าของข้อมูลโดยตรง", internal:"หน่วยงานภายใน", external:"หน่วยงานภายนอก",
  information_system:"ระบบสารสนเทศ", website:"เว็บไซต์", application:"แอปพลิเคชัน",
  student_registry:"ระบบทะเบียนนักศึกษา", hr_system:"ระบบบริหารงานบุคคล",
  e_document:"ระบบเอกสารอิเล็กทรอนิกส์", lms:"ระบบ LMS", erp:"ระบบ ERP",
  cloud:"ระบบคลาวด์", ai:"ระบบ AI",
  delete_system:"ลบออกจากระบบสารสนเทศ", destroy_document:"ทำลายเอกสาร", destroy_media:"ทำลายสื่อบันทึก",
  access_control:"ควบคุมการเข้าถึง", mfa:"ยืนยันตัวตนหลายขั้นตอน (MFA)", encryption:"การเข้ารหัสข้อมูล",
  firewall:"ไฟร์วอลล์", antivirus:"โปรแกรมป้องกันไวรัส", backup:"การสำรองข้อมูล",
  log_monitoring:"การบันทึกและตรวจสอบ Log", pdpa_policy:"นโยบาย PDPA",
  staff_training:"การอบรมเจ้าหน้าที่", nda:"ข้อตกลงไม่เปิดเผยข้อมูล (NDA)", risk_management:"การบริหารความเสี่ยง",
}

export const translateValue = (v: string) => VALUE_LABELS[v] ?? v

export const renderValue = (key: string, val: unknown): string => {
  if (val === null || val === undefined || val === "") return "-"
  if (typeof val === "boolean") return val ? "ใช่" : "ไม่ใช่"
  if (Array.isArray(val)) return val.length === 0 ? "-" : val.map(v => translateValue(String(v))).join(", ")
  if (key === "riskLevel") return RISK_LABELS[String(val)] ?? String(val)
  return translateValue(String(val))
}
