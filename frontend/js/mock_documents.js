/**
 * MediVault AI - High Fidelity Document Previews
 * Realistic visual templates simulating clinical laboratory reports and discharge summaries
 * for split-screen OCR verification.
 */

window.MOCK_DOCUMENTS = {
  "REP-9001": {
    fileName: "Blood_Report_05Sep2026.pdf",
    title: "METROPOLITAN CLINICAL LABORATORIES",
    subTitle: "Accredited Clinical Reference Laboratory #CL-89211",
    facilityInfo: "450 Medical Heights Blvd, Suite 200 • Tel: (555) 890-4100",
    patientName: "Sarah Jenkins",
    patientId: "P-10482",
    dob: "1981-04-14",
    specimenId: "SPEC-2026-88129",
    collectedDate: "05-Sep-2026 07:30 AM",
    receivedDate: "05-Sep-2026 08:00 AM",
    orderingPhysician: "Dr. Arthur Bell, MD",
    page: 1,
    totalPages: 2,
    rows: [
      { id: "LAB-101", testName: "Hemoglobin", result: "13.2", unit: "g/dL", refRange: "12.0 - 16.0", flag: "Normal" },
      { id: "LAB-102", testName: "Glucose, Fasting", result: "108", unit: "mg/dL", refRange: "70 - 100", flag: "HIGH" },
      { id: "LAB-103", testName: "Creatinine", result: "0.9", unit: "mg/dL", refRange: "0.6 - 1.2", flag: "Normal" },
      { id: "LAB-104", testName: "Potassium", result: "4.2", unit: "mmol/L", refRange: "3.5 - 5.0", flag: "Normal" },
      { id: "LAB-105", testName: "Microalbumin", result: "35", unit: "mg/L", refRange: "Not established", flag: "---" },
      { id: "LAB-106", testName: "TSH (3rd Gen)", result: "2.1", unit: "mIU/L", refRange: "0.4 - 4.0", flag: "Normal" }
    ],
    footerNotes: "Notes: Microalbumin reference range not established by this testing method. Fasting glucose exceeded reference limit. Clinical correlation advised by licensed physician."
  },
  "REP-9004": {
    fileName: "Lipid_Glycemic_Panel_20Aug2026.pdf",
    title: "ST. JUDE COMPREHENSIVE PATHOLOGY",
    subTitle: "Division of Endocrinology & Metabolic Testing",
    facilityInfo: "1200 St. Jude Parkway • Tel: (555) 772-9010",
    patientName: "Robert Chen",
    patientId: "P-10483",
    dob: "1964-02-19",
    specimenId: "LIP-2026-09144",
    collectedDate: "20-Aug-2026 08:15 AM",
    receivedDate: "20-Aug-2026 08:45 AM",
    orderingPhysician: "Dr. Clara Zhang, MD",
    page: 1,
    totalPages: 2,
    rows: [
      { id: "LAB-201", testName: "HbA1c (Glycated Hb)", result: "7.4", unit: "%", refRange: "4.0 - 5.6", flag: "HIGH" },
      { id: "LAB-202", testName: "Fasting Blood Sugar", result: "142", unit: "mg/dL", refRange: "70 - 99", flag: "HIGH" },
      { id: "LAB-203", testName: "Total Cholesterol", result: "215", unit: "mg/dL", refRange: "< 200", flag: "HIGH" },
      { id: "LAB-204", testName: "LDL Cholesterol", result: "138", unit: "mg/dL", refRange: "< 100", flag: "HIGH" },
      { id: "LAB-205", testName: "HDL Cholesterol", result: "42", unit: "mg/dL", refRange: "> 40", flag: "Normal" }
    ],
    footerNotes: "Specimen lipemic index normal. Fasting confirmed >10 hours. Target ranges based on National Heart, Lung, and Blood Institute clinical guidelines."
  },
  "REP-9005": {
    fileName: "Hospital_Discharge_Summary_12Jul2026.pdf",
    title: "VALLEY GENERAL HOSPITAL",
    subTitle: "Inpatient Clinical Summary & Discharge Record",
    facilityInfo: "740 River Road, West Wing • Main: (555) 330-8000",
    patientName: "Robert Chen",
    patientId: "P-10483",
    dob: "Age recorded: 63",
    specimenId: "ADM-99214-DISCH",
    collectedDate: "12-Jul-2026",
    receivedDate: "12-Jul-2026",
    orderingPhysician: "Dr. Marcus Thorne, MD",
    page: 1,
    totalPages: 3,
    rows: [
      { id: "MED-01", testName: "Discharge Medication", result: "Metformin 500mg", unit: "p.o. BID", refRange: "Prescription", flag: "Active" },
      { id: "MED-02", testName: "Discharge Medication", result: "Enalapril 5mg", unit: "p.o. Daily", refRange: "Prescription", flag: "Active" },
      { id: "MED-03", testName: "Discharge Medication", result: "Atorvastatin 20mg", unit: "p.o. QHS", refRange: "Prescription", flag: "Active" }
    ],
    footerNotes: "DISCHARGE ORDERS: Patient admitted for transient orthostatic dizziness. Regimen adjusted; tolerated Enalapril 5mg well without cough. Follow up in 4 weeks."
  }
};
