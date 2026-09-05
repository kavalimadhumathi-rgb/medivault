/**
 * MediVault AI - Clinical Datasets (Prompt 2 MVP)
 * STRICT NOTICE: DEMO DATA — NOT REAL PATIENT INFORMATION
 * All patients, tests, results, and records are entirely fictional and designed
 * solely for validating healthcare information organization workflows.
 */

const DEMO_USERS = [
  {
    id: "USR-001",
    name: "Dr. Emily Vance",
    email: "emily.vance@medivault.clinic",
    password: "clinician123",
    role: "Care Coordinator & Clinical Reviewer",
    facility: "Metropolitan Healthcare Center",
    token: "token_vance_991823"
  },
  {
    id: "USR-002",
    name: "Dr. Marcus Thorne",
    email: "marcus.thorne@medivault.clinic",
    password: "physician123",
    role: "Attending Physician",
    facility: "Valley General Hospital",
    token: "token_thorne_882914"
  }
];

const DEMO_PATIENTS = [
  {
    id: "P-10490",
    patient_id: "P-10490",
    fullName: "Ananya Rao",
    name: "Ananya Rao",
    dob: "1994-08-12",
    date_of_birth: "1994-08-12",
    age: 32,
    sex: "Female",
    bloodGroup: "O+",
    phone: "+1 (555) 342-9102",
    email: "ananya.rao.demo@example.com",
    emergencyContact: {
      name: "Vikram Rao",
      relation: "Spouse",
      phone: "+1 (555) 342-9103"
    },
    userProvided: {
      symptoms: [
        { text: "Fatigue during afternoon hours", dateAdded: "2026-08-25", source: "USER PROVIDED" },
        { text: "Mild leg swelling on prolonged standing", dateAdded: "2026-08-25", source: "USER PROVIDED" }
      ],
      conditions: [
        { text: "Gestational week 24 (singleton pregnancy)", diagnosedYear: "2026", source: "USER PROVIDED" },
        { text: "Mild Iron Deficiency Anemia", diagnosedYear: "2024", source: "USER PROVIDED" }
      ],
      allergies: [
        { allergen: "Sulfa Antibiotics", reaction: "Urticaria / rash", severity: "Moderate", source: "USER PROVIDED" }
      ],
      medications: [
        { name: "Prenatal Multivitamin with Folic Acid", dosage: "1 tablet", frequency: "Daily", source: "USER PROVIDED" },
        { name: "Ferrous Ascorbate", dosage: "100 mg elemental iron", frequency: "Once daily with food", source: "USER PROVIDED" }
      ],
      procedures: [],
      medicalHistory: "First pregnancy. Normal 1st trimester ultrasound screening. Non-smoker.",
      familyHistory: "Mother has Type 2 Diabetes; father had hypertension."
    },
    reportCount: 2,
    lastUpdated: "2026-09-05T10:15:00Z",
    verificationStatus: "Pending Review",
    summary: null
  },
  {
    id: "P-10491",
    patient_id: "P-10491",
    fullName: "Rahul Mehta",
    name: "Rahul Mehta",
    dob: "1978-05-20",
    date_of_birth: "1978-05-20",
    age: 48,
    sex: "Male",
    bloodGroup: "B+",
    phone: "+1 (555) 671-8820",
    email: "rahul.mehta.demo@example.com",
    emergencyContact: {
      name: "Pooja Mehta",
      relation: "Spouse",
      phone: "+1 (555) 671-8821"
    },
    userProvided: {
      symptoms: [
        { text: "Occasional blurred vision with high carbohydrate meals", dateAdded: "2026-08-10", source: "USER PROVIDED" },
        { text: "Mild nocturnal calf cramps", dateAdded: "2026-08-10", source: "USER PROVIDED" }
      ],
      conditions: [
        { text: "Type 2 Diabetes Mellitus", diagnosedYear: "2019", source: "USER PROVIDED" },
        { text: "Essential Hypertension", diagnosedYear: "2021", source: "USER PROVIDED" },
        { text: "Hyperlipidemia", diagnosedYear: "2020", source: "USER PROVIDED" }
      ],
      allergies: [
        { allergen: "Aspirin (NSAIDs)", reaction: "Bronchospasm / wheezing", severity: "Severe", source: "USER PROVIDED" }
      ],
      medications: [
        { name: "Metformin", dosage: "500 mg", frequency: "Twice daily after meals", source: "USER PROVIDED" },
        { name: "Telmisartan", dosage: "40 mg", frequency: "Once daily morning", source: "USER PROVIDED" },
        { name: "Rosuvastatin", dosage: "10 mg", frequency: "Once daily bedtime", source: "USER PROVIDED" }
      ],
      procedures: [
        { procedure: "Inguinal Hernia Repair", year: "2017", hospital: "Metropolitan Surgical Center", source: "USER PROVIDED" }
      ],
      medicalHistory: "Annual diabetic eye exam normal in Jan 2026. Sedentary occupation.",
      familyHistory: "Both parents diagnosed with Type 2 Diabetes in their 50s. Father had CABG at age 62."
    },
    reportCount: 3,
    lastUpdated: "2026-09-04T17:30:00Z",
    verificationStatus: "Needs Human Review",
    summary: null
  },
  {
    id: "P-10482",
    patient_id: "P-10482",
    fullName: "Sarah Jenkins",
    name: "Sarah Jenkins",
    dob: "1981-04-14",
    date_of_birth: "1981-04-14",
    age: 45,
    sex: "Female",
    phone: "+1 (555) 234-8901",
    email: "sarah.jenkins.demo@example.com",
    emergencyContact: {
      name: "David Jenkins",
      relation: "Spouse",
      phone: "+1 (555) 234-8902"
    },
    userProvided: {
      symptoms: [
        { text: "Persistent morning fatigue", dateAdded: "2026-08-28", source: "USER PROVIDED" }
      ],
      conditions: [
        { text: "Mild Essential Hypertension", diagnosedYear: "2022", source: "USER PROVIDED" },
        { text: "Primary Hypothyroidism", diagnosedYear: "2019", source: "USER PROVIDED" }
      ],
      allergies: [
        { allergen: "Penicillin", reaction: "Cutaneous rash", severity: "Moderate", source: "USER PROVIDED" }
      ],
      medications: [
        { name: "Levothyroxine", dosage: "50 mcg", frequency: "Once daily, morning", source: "USER PROVIDED" },
        { name: "Amlodipine", dosage: "5 mg", frequency: "Once daily", source: "USER PROVIDED" }
      ],
      procedures: [],
      medicalHistory: "Resolved gestational diabetes (2011).",
      familyHistory: "Mother had Type 2 Diabetes."
    },
    reportCount: 2,
    lastUpdated: "2026-09-05T09:30:00Z",
    verificationStatus: "Verified",
    summary: null
  },
  {
    id: "P-10492",
    patient_id: "P-10492",
    fullName: "David Kim",
    name: "David Kim",
    dob: "1968-11-15",
    age: 58,
    sex: "Male",
    bloodGroup: "O+",
    phone: "+1 (555) 819-2034",
    email: "david.kim.demo@example.com",
    emergencyContact: {
      name: "Grace Kim",
      relation: "Spouse",
      phone: "+1 (555) 819-2035"
    },
    userProvided: {
      symptoms: [
        { text: "Mild exertional shortness of breath on climbing 2 flights", dateAdded: "2026-08-15", source: "USER PROVIDED" }
      ],
      conditions: [
        { text: "Coronary Artery Disease (s/p LAD Stent in 2024)", diagnosedYear: "2024", source: "USER PROVIDED" },
        { text: "Hypercholesterolemia", diagnosedYear: "2020", source: "USER PROVIDED" }
      ],
      allergies: [
        { allergen: "Iodinated Radiocontrast", reaction: "Hives and nausea", severity: "Moderate", source: "USER PROVIDED" }
      ],
      medications: [
        { name: "Aspirin", dosage: "81 mg", frequency: "Once daily", source: "USER PROVIDED" },
        { name: "Clopidogrel", dosage: "75 mg", frequency: "Once daily", source: "USER PROVIDED" },
        { name: "Atorvastatin", dosage: "40 mg", frequency: "Once daily bedtime", source: "USER PROVIDED" }
      ],
      procedures: [
        { procedure: "Percutaneous Coronary Intervention (PCI)", year: "2024", hospital: "Metropolitan Heart Center", source: "USER PROVIDED" }
      ],
      medicalHistory: "Cardiac rehab completed Nov 2024. Non-smoker.",
      familyHistory: "Father died of sudden cardiac arrest at age 54."
    },
    reportCount: 2,
    lastUpdated: "2026-09-03T14:20:00Z",
    verificationStatus: "Verified",
    summary: null
  },
  {
    id: "P-10493",
    patient_id: "P-10493",
    fullName: "Priya Patel",
    name: "Priya Patel",
    dob: "2000-03-22",
    age: 26,
    sex: "Female",
    bloodGroup: "B+",
    phone: "+1 (555) 902-3341",
    email: "priya.patel.demo@example.com",
    emergencyContact: {
      name: "Ramesh Patel",
      relation: "Father",
      phone: "+1 (555) 902-3342"
    },
    userProvided: {
      symptoms: [
        { text: "Irregular menstrual cycles", dateAdded: "2026-08-12", source: "USER PROVIDED" },
        { text: "Persistent acne along jawline", dateAdded: "2026-08-12", source: "USER PROVIDED" }
      ],
      conditions: [
        { text: "Polycystic Ovary Syndrome (PCOS)", diagnosedYear: "2023", source: "USER PROVIDED" },
        { text: "Insulin Resistance", diagnosedYear: "2023", source: "USER PROVIDED" }
      ],
      allergies: [],
      medications: [
        { name: "Metformin ER", dosage: "750 mg", frequency: "Once daily with dinner", source: "USER PROVIDED" },
        { name: "Spironolactone", dosage: "50 mg", frequency: "Once daily", source: "USER PROVIDED" }
      ],
      procedures: [],
      medicalHistory: "Pelvic ultrasound 2023 demonstrated bilateral polycystic morphology.",
      familyHistory: "Mother and aunt have Type 2 Diabetes."
    },
    reportCount: 1,
    lastUpdated: "2026-09-02T11:00:00Z",
    verificationStatus: "Needs Review",
    summary: null
  },
  {
    id: "P-10494",
    patient_id: "P-10494",
    fullName: "Michael Torres",
    name: "Michael Torres",
    dob: "1959-07-08",
    age: 67,
    sex: "Male",
    bloodGroup: "AB+",
    phone: "+1 (555) 472-8819",
    email: "michael.torres.demo@example.com",
    emergencyContact: {
      name: "Elena Torres",
      relation: "Daughter",
      phone: "+1 (555) 472-8820"
    },
    userProvided: {
      symptoms: [
        { text: "Intermittent left great toe joint pain", dateAdded: "2026-07-20", source: "USER PROVIDED" }
      ],
      conditions: [
        { text: "Chronic Kidney Disease (Stage 3a)", diagnosedYear: "2022", source: "USER PROVIDED" },
        { text: "Gout", diagnosedYear: "2021", source: "USER PROVIDED" }
      ],
      allergies: [
        { allergen: "Codeine", reaction: "Severe nausea and dizziness", severity: "Moderate", source: "USER PROVIDED" }
      ],
      medications: [
        { name: "Allopurinol", dosage: "100 mg", frequency: "Daily", source: "USER PROVIDED" },
        { name: "Losartan", dosage: "25 mg", frequency: "Daily", source: "USER PROVIDED" }
      ],
      procedures: [],
      medicalHistory: "Baseline eGFR tracked quarterly.",
      familyHistory: "Father had hypertension."
    },
    reportCount: 2,
    lastUpdated: "2026-08-30T16:00:00Z",
    verificationStatus: "Verified",
    summary: null
  }
];

const DEMO_REPORTS = [
  // Ananya Rao Reports
  {
    id: "REP-9010",
    patientId: "P-10490",
    patient_id: "P-10490",
    fileName: "Comprehensive_Antenatal_Panel_01Sep2026.pdf",
    file_name: "Comprehensive_Antenatal_Panel_01Sep2026.pdf",
    fileSize: "1.6 MB",
    fileType: "application/pdf",
    reportType: "Blood Test",
    report_type: "Blood Test",
    reportDate: "2026-09-01",
    report_date: "2026-09-01",
    uploadedAt: "2026-09-01T10:00:00Z",
    uploaded_at: "2026-09-01T10:00:00Z",
    facility: "Women's Specialty Healthcare Laboratory",
    orderingPhysician: "Dr. Maya Swaminathan, MD",
    pipelineStatus: "Review",
    pipelineStep: 5,
    verificationStatus: "Pending Review",
    pageCount: 2,
    rawTextSnippet: "WOMEN'S SPECIALTY HEALTHCARE LAB\nPatient: Ananya Rao (P-10490) Age: 32\nHemoglobin: 10.6 g/dL [11.5 - 15.0] LOW\nFerritin: 12 ng/mL [15 - 150] LOW\nPlatelet Count: 210 K/uL [150 - 450] Normal\nFasting Blood Sugar: 84 mg/dL [70 - 95] Normal\nSerum Iron: 48 ug/dL [50 - 170] LOW"
  },
  {
    id: "REP-9011",
    patientId: "P-10490",
    patient_id: "P-10490",
    fileName: "Routine_Obstetric_Urinalysis_15Aug2026.pdf",
    file_name: "Routine_Obstetric_Urinalysis_15Aug2026.pdf",
    fileSize: "890 KB",
    fileType: "application/pdf",
    reportType: "Urine Test",
    report_type: "Urine Test",
    reportDate: "2026-08-15",
    report_date: "2026-08-15",
    uploadedAt: "2026-08-15T14:30:00Z",
    uploaded_at: "2026-08-15T14:30:00Z",
    facility: "Metropolitan Diagnostic Laboratories",
    orderingPhysician: "Dr. Maya Swaminathan, MD",
    pipelineStatus: "Added to Record",
    pipelineStep: 6,
    verificationStatus: "Verified",
    pageCount: 1,
    rawTextSnippet: "METROPOLITAN DIAGNOSTIC LABS\nUrinalysis Obstetric Profile\nSpecific Gravity: 1.018 [1.005 - 1.030] Normal\npH: 6.5 [4.5 - 8.0] Normal\nProtein: Negative [Negative] Normal\nGlucose: Negative [Negative] Normal"
  },

  // Rahul Mehta Reports
  {
    id: "REP-9012",
    patientId: "P-10491",
    patient_id: "P-10491",
    fileName: "Comprehensive_Metabolic_Lipid_04Sep2026.pdf",
    file_name: "Comprehensive_Metabolic_Lipid_04Sep2026.pdf",
    fileSize: "2.1 MB",
    fileType: "application/pdf",
    reportType: "Blood Test",
    report_type: "Blood Test",
    reportDate: "2026-09-04",
    report_date: "2026-09-04",
    uploadedAt: "2026-09-04T08:45:00Z",
    uploaded_at: "2026-09-04T08:45:00Z",
    facility: "St. Jude Comprehensive Pathology Center",
    orderingPhysician: "Dr. Clara Zhang, MD",
    pipelineStatus: "Review",
    pipelineStep: 5,
    verificationStatus: "Needs Human Review",
    pageCount: 2,
    rawTextSnippet: "ST. JUDE PATHOLOGY\nPatient: Rahul Mehta (P-10491)\nHbA1c: 7.6 % [4.0 - 5.6] HIGH\nFasting Blood Glucose: 148 mg/dL [70 - 99] HIGH\nTotal Cholesterol: 218 mg/dL [< 200] HIGH\nLDL Cholesterol: 142 mg/dL [< 100] HIGH\nHDL Cholesterol: 41 mg/dL [> 40] Normal\nTriglycerides: 185 mg/dL [< 150] HIGH"
  },
  {
    id: "REP-9013",
    patientId: "P-10491",
    patient_id: "P-10491",
    fileName: "Hospital_Discharge_Summary_20Aug2026.pdf",
    file_name: "Hospital_Discharge_Summary_20Aug2026.pdf",
    fileSize: "1.9 MB",
    fileType: "application/pdf",
    reportType: "Discharge Summary",
    report_type: "Discharge Summary",
    reportDate: "2026-08-20",
    report_date: "2026-08-20",
    uploadedAt: "2026-08-20T16:00:00Z",
    uploaded_at: "2026-08-20T16:00:00Z",
    facility: "Valley General Hospital",
    orderingPhysician: "Dr. Marcus Thorne, MD",
    pipelineStatus: "Review",
    pipelineStep: 5,
    verificationStatus: "Needs Human Review",
    pageCount: 3,
    rawTextSnippet: "VALLEY GENERAL HOSPITAL DISCHARGE SUMMARY\nPatient: Rahul Mehta\nRecorded Age: 49 (Discrepancy with profile age 48)\nDischarge Medications: Metformin 500mg BID, Amlodipine 5mg daily (conflicts with profile Telmisartan 40mg), Atorvastatin 20mg daily."
  },
  {
    id: "REP-9014",
    patientId: "P-10491",
    patient_id: "P-10491",
    fileName: "Handwritten_Glucose_Log_12Jul2026.jpg",
    file_name: "Handwritten_Glucose_Log_12Jul2026.jpg",
    fileSize: "680 KB",
    fileType: "image/jpeg",
    reportType: "Blood Test",
    report_type: "Blood Test",
    reportDate: "2026-07-12",
    report_date: "2026-07-12",
    uploadedAt: "2026-07-12T09:00:00Z",
    uploaded_at: "2026-07-12T09:00:00Z",
    facility: "Self-Monitored Glucometer Log",
    orderingPhysician: "Patient Self-Log",
    pipelineStatus: "Review",
    pipelineStep: 5,
    verificationStatus: "Needs Clarification",
    pageCount: 1,
    rawTextSnippet: "Glucometer Reading\nFasting Blood Glucose: 138 [Unit Not Written] [Ref: 70 - 100 mg/dL]\nLow OCR clarity; handwritten number slightly blurred."
  },
  {
    id: "REP-9015",
    patientId: "P-10491",
    patient_id: "P-10491",
    fileName: "Cardiovascular_Biomarker_Panel_04Sep2026.pdf",
    file_name: "Cardiovascular_Biomarker_Panel_04Sep2026.pdf",
    fileSize: "1.4 MB",
    fileType: "application/pdf",
    reportType: "Pathology Report",
    report_type: "Pathology Report",
    reportDate: "2026-09-04",
    report_date: "2026-09-04",
    uploadedAt: "2026-09-04T11:00:00Z",
    uploaded_at: "2026-09-04T11:00:00Z",
    facility: "Heart & Vascular Specialty Institute",
    orderingPhysician: "Dr. Clara Zhang, MD",
    pipelineStatus: "Review",
    pipelineStep: 5,
    verificationStatus: "Pending Review",
    pageCount: 1,
    rawTextSnippet: "HEART & VASCULAR SPECIALTY INSTITUTE\nPatient: Rahul Mehta\nLipoprotein(a): 78 nmol/L [Reference range: not provided by assay method]\nHomocysteine: 11.2 umol/L [5.0 - 15.0] Normal"
  }
];

const DEMO_LAB_RESULTS = [
  // Ananya Rao - Antenatal Panel
  {
    id: "LAB-401",
    report_id: "REP-9010",
    reportId: "REP-9010",
    patientId: "P-10490",
    patient_id: "P-10490",
    sourceDoc: "Comprehensive_Antenatal_Panel_01Sep2026.pdf",
    source_page: 1,
    pageNumber: 1,
    test_name: "Hemoglobin",
    testName: "Hemoglobin",
    value: "10.6",
    numericValue: 10.6,
    unit: "g/dL",
    reference_range: "11.5–15.0",
    referenceRange: "11.5–15.0",
    hasSourceRange: true,
    status: "Low", // strictly calculated from source: 10.6 < 11.5
    observation: "Below standard non-pregnant threshold. Note: patient is in gestational week 24.",
    confidence: 0.97,
    verification_status: "Pending Review",
    verificationStatus: "Pending Review",
    testDate: "2026-09-01",
    provenanceBadge: "SOURCE EXTRACTED"
  },
  {
    id: "LAB-402",
    report_id: "REP-9010",
    reportId: "REP-9010",
    patientId: "P-10490",
    patient_id: "P-10490",
    sourceDoc: "Comprehensive_Antenatal_Panel_01Sep2026.pdf",
    source_page: 1,
    pageNumber: 1,
    test_name: "Ferritin",
    testName: "Ferritin",
    value: "12",
    numericValue: 12,
    unit: "ng/mL",
    reference_range: "15–150",
    referenceRange: "15–150",
    hasSourceRange: true,
    status: "Low", // strictly calculated: 12 < 15
    observation: "Serum iron store below lower reference bound stated by laboratory.",
    confidence: 0.95,
    verification_status: "Pending Review",
    verificationStatus: "Pending Review",
    testDate: "2026-09-01",
    provenanceBadge: "SOURCE EXTRACTED"
  },
  {
    id: "LAB-403",
    report_id: "REP-9010",
    reportId: "REP-9010",
    patientId: "P-10490",
    patient_id: "P-10490",
    sourceDoc: "Comprehensive_Antenatal_Panel_01Sep2026.pdf",
    source_page: 1,
    pageNumber: 1,
    test_name: "Platelet Count",
    testName: "Platelet Count",
    value: "210",
    numericValue: 210,
    unit: "K/uL",
    reference_range: "150–450",
    referenceRange: "150–450",
    hasSourceRange: true,
    status: "Normal", // strictly calculated: 150 <= 210 <= 450
    observation: "Normal thrombocyte density.",
    confidence: 0.96,
    verification_status: "Verified",
    verificationStatus: "Verified",
    verified_by: "Dr. Emily Vance",
    verified_at: "2026-09-01T11:00:00Z",
    testDate: "2026-09-01",
    provenanceBadge: "SOURCE EXTRACTED"
  },
  {
    id: "LAB-404",
    report_id: "REP-9010",
    reportId: "REP-9010",
    patientId: "P-10490",
    patient_id: "P-10490",
    sourceDoc: "Comprehensive_Antenatal_Panel_01Sep2026.pdf",
    source_page: 2,
    pageNumber: 2,
    test_name: "Fasting Blood Sugar",
    testName: "Fasting Blood Sugar",
    value: "84",
    numericValue: 84,
    unit: "mg/dL",
    reference_range: "70–95",
    referenceRange: "70–95",
    hasSourceRange: true,
    status: "Normal", // strictly calculated: 70 <= 84 <= 95
    observation: "Normal fasting glycemic level for second trimester screening.",
    confidence: 0.98,
    verification_status: "Verified",
    verificationStatus: "Verified",
    verified_by: "Dr. Emily Vance",
    verified_at: "2026-09-01T11:05:00Z",
    testDate: "2026-09-01",
    provenanceBadge: "SOURCE EXTRACTED"
  },

  // Rahul Mehta - Metabolic & Lipid Panel
  {
    id: "LAB-501",
    report_id: "REP-9012",
    reportId: "REP-9012",
    patientId: "P-10491",
    patient_id: "P-10491",
    sourceDoc: "Comprehensive_Metabolic_Lipid_04Sep2026.pdf",
    source_page: 1,
    pageNumber: 1,
    test_name: "HbA1c",
    testName: "HbA1c",
    value: "7.6",
    numericValue: 7.6,
    unit: "%",
    reference_range: "4.0–5.6",
    referenceRange: "4.0–5.6",
    hasSourceRange: true,
    status: "High", // strictly calculated: 7.6 > 5.6
    observation: "Above standard nondiabetic range provided by source lab.",
    confidence: 0.98,
    verification_status: "Verified",
    verificationStatus: "Verified",
    verified_by: "Dr. Emily Vance",
    verified_at: "2026-09-04T09:30:00Z",
    testDate: "2026-09-04",
    provenanceBadge: "SOURCE EXTRACTED"
  },
  {
    id: "LAB-502",
    report_id: "REP-9012",
    reportId: "REP-9012",
    patientId: "P-10491",
    patient_id: "P-10491",
    sourceDoc: "Comprehensive_Metabolic_Lipid_04Sep2026.pdf",
    source_page: 1,
    pageNumber: 1,
    test_name: "Fasting Blood Glucose",
    testName: "Fasting Blood Glucose",
    value: "148",
    numericValue: 148,
    unit: "mg/dL",
    reference_range: "70–99",
    referenceRange: "70–99",
    hasSourceRange: true,
    status: "High", // strictly calculated: 148 > 99
    observation: "Elevated compared to 70–99 reference interval in source report.",
    confidence: 0.96,
    verification_status: "Pending Review",
    verificationStatus: "Pending Review",
    testDate: "2026-09-04",
    provenanceBadge: "SOURCE EXTRACTED"
  },
  {
    id: "LAB-503",
    report_id: "REP-9012",
    reportId: "REP-9012",
    patientId: "P-10491",
    patient_id: "P-10491",
    sourceDoc: "Comprehensive_Metabolic_Lipid_04Sep2026.pdf",
    source_page: 1,
    pageNumber: 1,
    test_name: "Total Cholesterol",
    testName: "Total Cholesterol",
    value: "218",
    numericValue: 218,
    unit: "mg/dL",
    reference_range: "< 200",
    referenceRange: "< 200",
    hasSourceRange: true,
    status: "High", // strictly calculated: 218 > 200
    observation: "Above upper limit of 200 mg/dL provided in report.",
    confidence: 0.94,
    verification_status: "Verified",
    verificationStatus: "Verified",
    verified_by: "Dr. Emily Vance",
    verified_at: "2026-09-04T09:32:00Z",
    testDate: "2026-09-04",
    provenanceBadge: "SOURCE EXTRACTED"
  },
  {
    id: "LAB-504",
    report_id: "REP-9012",
    reportId: "REP-9012",
    patientId: "P-10491",
    patient_id: "P-10491",
    sourceDoc: "Comprehensive_Metabolic_Lipid_04Sep2026.pdf",
    source_page: 2,
    pageNumber: 2,
    test_name: "LDL Cholesterol",
    testName: "LDL Cholesterol",
    value: "142",
    numericValue: 142,
    unit: "mg/dL",
    reference_range: "< 100",
    referenceRange: "< 100",
    hasSourceRange: true,
    status: "High", // strictly calculated: 142 > 100
    observation: "Exceeds primary clinical threshold of 100 mg/dL in source.",
    confidence: 0.93,
    verification_status: "Verified",
    verificationStatus: "Verified",
    verified_by: "Dr. Emily Vance",
    verified_at: "2026-09-04T09:33:00Z",
    testDate: "2026-09-04",
    provenanceBadge: "SOURCE EXTRACTED"
  },

  // Rahul Mehta - Low Confidence & Missing Unit Example
  {
    id: "LAB-505",
    report_id: "REP-9014",
    reportId: "REP-9014",
    patientId: "P-10491",
    patient_id: "P-10491",
    sourceDoc: "Handwritten_Glucose_Log_12Jul2026.jpg",
    source_page: 1,
    pageNumber: 1,
    test_name: "Fasting Blood Glucose (Self-Log)",
    testName: "Fasting Blood Glucose (Self-Log)",
    value: "138",
    numericValue: 138,
    unit: "Unspecified in source",
    reference_range: "70–100 mg/dL",
    referenceRange: "70–100 mg/dL",
    hasSourceRange: true,
    status: "High",
    observation: "Handwritten digit from home glucometer; unit was omitted by patient.",
    confidence: 0.52, // LOW CONFIDENCE EXAMPLE
    verification_status: "Needs Clarification",
    verificationStatus: "Needs Clarification",
    testDate: "2026-07-12",
    provenanceBadge: "Needs Clarification"
  },

  // Rahul Mehta - Missing Reference Range Example (CRITICAL RULE!)
  {
    id: "LAB-506",
    report_id: "REP-9015",
    reportId: "REP-9015",
    patientId: "P-10491",
    patient_id: "P-10491",
    sourceDoc: "Cardiovascular_Biomarker_Panel_04Sep2026.pdf",
    source_page: 1,
    pageNumber: 1,
    test_name: "Lipoprotein(a)",
    testName: "Lipoprotein(a)",
    value: "78",
    numericValue: 78,
    unit: "nmol/L",
    reference_range: "Not provided",
    referenceRange: "Not provided",
    hasSourceRange: false,
    status: "Cannot determine", // CRITICAL RULE: NEVER invent range!
    observation: "Reference interval not established by testing methodology in source report.",
    confidence: 0.88,
    verification_status: "Pending Review",
    verificationStatus: "Pending Review",
    testDate: "2026-09-04",
    provenanceBadge: "SOURCE EXTRACTED"
  }
];

const DEMO_INCONSISTENCIES = [
  {
    id: "INC-101",
    patientId: "P-10491",
    patient_id: "P-10491",
    type: "Conflicting Medications",
    title: "Blood Pressure Regimen Discrepancy",
    severity: "High",
    description: "Current patient profile lists 'Telmisartan 40 mg daily', whereas Hospital Discharge Summary (20 Aug 2026) specifies 'Amlodipine 5 mg daily'.",
    recordA: {
      source: "Patient Profile (USER PROVIDED)",
      value: "Telmisartan 40 mg daily",
      date: "2026-08-10"
    },
    recordB: {
      source: "Hospital_Discharge_Summary_20Aug2026.pdf",
      value: "Amlodipine 5 mg daily",
      date: "2026-08-20"
    },
    status: "Needs Human Review",
    recommendedAction: "Confirm with patient or prescribing physician whether Amlodipine was an inpatient switch or an active substitution."
  },
  {
    id: "INC-102",
    patientId: "P-10491",
    patient_id: "P-10491",
    type: "Demographic Discrepancy",
    title: "Patient Age Discrepancy",
    severity: "Medium",
    description: "User profile states patient age is 48 (DOB 1978-05-20), while Hospital Discharge Summary recorded age as 49 on admission face sheet.",
    recordA: {
      source: "Intake Profile (USER PROVIDED)",
      value: "Age 48 (DOB 1978-05-20)",
      date: "2026-08-10"
    },
    recordB: {
      source: "Hospital_Discharge_Summary_20Aug2026.pdf",
      value: "Age 49 recorded on admission sheet",
      date: "2026-08-20"
    },
    status: "Needs Human Review",
    recommendedAction: "Verify birth certificate or official ID card."
  },
  {
    id: "INC-103",
    patientId: "P-10491",
    patient_id: "P-10491",
    type: "Missing Reference Range",
    title: "Lipoprotein(a) Reference Range Not Provided",
    severity: "Low",
    description: "Source report 'Cardiovascular_Biomarker_Panel_04Sep2026.pdf' did not report a reference range for Lipoprotein(a). Status is marked strictly as 'Cannot determine'.",
    recordA: {
      source: "Cardiovascular_Biomarker_Panel_04Sep2026.pdf",
      value: "78 nmol/L (Ref: Not provided)",
      date: "2026-09-04"
    },
    recordB: {
      source: "System Safety Engine",
      value: "Reference range: Not provided | Status: Cannot determine",
      date: "2026-09-04"
    },
    status: "Needs Human Review",
    recommendedAction: "Do not extrapolate clinical risk bands without explicit assay calibration."
  }
];

const DEMO_CLARIFICATIONS = [
  {
    id: "CLR-101",
    patientId: "P-10491",
    reportId: "REP-9014",
    field: "Fasting Blood Glucose Unit",
    extractedValue: "138",
    question: "The self-monitored glucose log contains a value of '138' with low OCR clarity (52% confidence) and without an explicit unit. Can you confirm the unit shown on the glucometer screen?",
    options: ["mg/dL", "mmol/L", "Other / Unclear"],
    status: "Pending Clarification",
    sourceDoc: "Handwritten_Glucose_Log_12Jul2026.jpg",
    page: 1
  }
];

const DEMO_TIMELINE_EVENTS = [
  {
    id: "EVT-201",
    patientId: "P-10490",
    timestamp: "2026-09-01T11:05:00Z",
    dateFormatted: "01 Sep 2026",
    eventType: "Verification",
    title: "Hemoglobin and Fasting Sugar verified",
    description: "Dr. Emily Vance verified extracted laboratory parameters from Antenatal Panel.",
    provenance: "User Action"
  },
  {
    id: "EVT-202",
    patientId: "P-10490",
    timestamp: "2026-09-01T10:05:00Z",
    dateFormatted: "01 Sep 2026",
    eventType: "AI Extraction",
    title: "AI extraction completed",
    description: "5 parameters extracted from Comprehensive_Antenatal_Panel_01Sep2026.pdf.",
    provenance: "AI Engine"
  },
  {
    id: "EVT-203",
    patientId: "P-10490",
    timestamp: "2026-09-01T10:00:00Z",
    dateFormatted: "01 Sep 2026",
    eventType: "Upload",
    title: "Antenatal blood panel uploaded",
    description: "File Comprehensive_Antenatal_Panel_01Sep2026.pdf uploaded.",
    provenance: "User Action"
  },
  {
    id: "EVT-204",
    patientId: "P-10490",
    timestamp: "2026-08-25T15:00:00Z",
    dateFormatted: "25 Aug 2026",
    eventType: "Intake",
    title: "Patient profile created",
    description: "Demographics, gestational history, and supplements recorded as USER PROVIDED.",
    provenance: "USER PROVIDED"
  },
  {
    id: "EVT-301",
    patientId: "P-10491",
    timestamp: "2026-09-04T09:30:00Z",
    dateFormatted: "04 Sep 2026",
    eventType: "Verification",
    title: "HbA1c value verified",
    description: "HbA1c 7.6% certified as Verified by Dr. Emily Vance.",
    provenance: "User Action"
  },
  {
    id: "EVT-302",
    patientId: "P-10491",
    timestamp: "2026-09-04T08:50:00Z",
    dateFormatted: "04 Sep 2026",
    eventType: "AI Extraction",
    title: "Metabolic panel extracted",
    description: "6 parameters extracted from Comprehensive_Metabolic_Lipid_04Sep2026.pdf.",
    provenance: "AI Engine"
  },
  {
    id: "EVT-303",
    patientId: "P-10491",
    timestamp: "2026-08-20T16:15:00Z",
    dateFormatted: "20 Aug 2026",
    eventType: "Conflict Detected",
    title: "Medication conflict detected",
    description: "Telmisartan 40mg vs Amlodipine 5mg flagged for human review.",
    provenance: "AI Engine"
  }
];

const DEMO_AUDIT_LOGS = [
  {
    id: "AUD-2001",
    timestamp: "2026-09-04T09:30:00Z",
    user: "Dr. Emily Vance",
    user_id: "USR-001",
    patient_id: "P-10491",
    action: "FIELD_VERIFIED",
    affectedRecord: "HbA1c (LAB-501)",
    previous_value: "Pending Review | 7.6 %",
    new_value: "Verified | 7.6 %",
    notes: "Verified against source document page 1"
  },
  {
    id: "AUD-2002",
    timestamp: "2026-09-04T08:50:12Z",
    user: "AI Extraction System v2.4",
    user_id: "AI-SYS",
    patient_id: "P-10491",
    action: "AI_EXTRACTION_COMPLETED",
    affectedRecord: "Report REP-9012",
    previous_value: "Processing",
    new_value: "Extracted 6 parameters",
    notes: "Strict reference range rule applied"
  },
  {
    id: "AUD-2003",
    timestamp: "2026-09-01T11:05:00Z",
    user: "Dr. Emily Vance",
    user_id: "USR-001",
    patient_id: "P-10490",
    action: "FIELD_VERIFIED",
    affectedRecord: "Fasting Blood Sugar (LAB-404)",
    previous_value: "Pending Review | 84 mg/dL",
    new_value: "Verified | 84 mg/dL",
    notes: "Confirmed normal baseline"
  },
  {
    id: "AUD-2004",
    timestamp: "2026-08-25T15:00:00Z",
    user: "Dr. Emily Vance",
    user_id: "USR-001",
    patient_id: "P-10490",
    action: "PATIENT_CREATED",
    affectedRecord: "Patient P-10490 (Ananya Rao)",
    previous_value: "None",
    new_value: "Profile created with 4 sections",
    notes: "Tagged strictly as USER PROVIDED"
  }
];

module.exports = {
  DEMO_USERS,
  DEMO_PATIENTS,
  DEMO_REPORTS,
  DEMO_LAB_RESULTS,
  DEMO_INCONSISTENCIES,
  DEMO_CLARIFICATIONS,
  DEMO_TIMELINE_EVENTS,
  DEMO_AUDIT_LOGS
};
