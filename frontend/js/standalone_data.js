/**
 * MediVault AI - Standalone Embedded Clinical Data Store
 * Provides guaranteed offline resilience so the application works seamlessly
 * both via HTTP server and when opened directly via file:// in any browser.
 */
window.STANDALONE_STORE = {
  users: [
    {
      id: "USR-001",
      name: "Dr. Emily Vance",
      email: "emily.vance@medivault.clinic",
      role: "Care Coordinator & Clinical Reviewer",
      facility: "Metropolitan Healthcare Center"
    },
    {
      id: "USR-002",
      name: "Dr. Marcus Thorne",
      email: "marcus.thorne@medivault.clinic",
      role: "Attending Physician",
      facility: "Valley General Hospital"
    }
  ],

  patients: [
    {
      id: "P-10491",
      patient_id: "P-10491",
      fullName: "Rahul Mehta",
      name: "Rahul Mehta",
      dob: "1978-05-20",
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
      verificationStatus: "Needs Human Review"
    },
    {
      id: "P-10490",
      patient_id: "P-10490",
      fullName: "Ananya Rao",
      name: "Ananya Rao",
      dob: "1994-08-12",
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
      verificationStatus: "Pending Review"
    },
    {
      id: "P-10482",
      patient_id: "P-10482",
      fullName: "Sarah Jenkins",
      name: "Sarah Jenkins",
      dob: "1981-04-14",
      age: 45,
      sex: "Female",
      bloodGroup: "A+",
      phone: "+1 (555) 234-8901",
      email: "sarah.jenkins.demo@example.com",
      emergencyContact: {
        name: "David Jenkins",
        relation: "Spouse",
        phone: "+1 (555) 234-8902"
      },
      userProvided: {
        symptoms: [
          { text: "Persistent morning fatigue", dateAdded: "2026-08-28", source: "USER PROVIDED" },
          { text: "Cold intolerance", dateAdded: "2026-08-28", source: "USER PROVIDED" }
        ],
        conditions: [
          { text: "Primary Hypothyroidism", diagnosedYear: "2019", source: "USER PROVIDED" },
          { text: "Mild Essential Hypertension", diagnosedYear: "2022", source: "USER PROVIDED" }
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
      verificationStatus: "Verified"
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
          { procedure: "Percutaneous Coronary Intervention (PCI) with Drug-Eluting Stent", year: "2024", hospital: "Metropolitan Heart Center", source: "USER PROVIDED" }
        ],
        medicalHistory: "Cardiac rehab completed Nov 2024. Non-smoker.",
        familyHistory: "Father died of sudden cardiac arrest at age 54."
      },
      reportCount: 2,
      lastUpdated: "2026-09-03T14:20:00Z",
      verificationStatus: "Verified"
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
      verificationStatus: "Needs Review"
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
      verificationStatus: "Verified"
    }
  ],

  reports: [
    {
      id: "REP-9012",
      patientId: "P-10491",
      fileName: "Comprehensive_Metabolic_Lipid_04Sep2026.pdf",
      reportType: "Blood Chemistry & Lipid Panel",
      reportDate: "2026-09-04",
      facility: "St. Jude Comprehensive Pathology Center",
      orderingPhysician: "Dr. Clara Zhang, MD",
      status: "Needs Review",
      fileSize: "2.1 MB"
    },
    {
      id: "REP-9010",
      patientId: "P-10490",
      fileName: "Comprehensive_Antenatal_Panel_01Sep2026.pdf",
      reportType: "Maternal-Fetal Antenatal Panel",
      reportDate: "2026-09-01",
      facility: "Women's Specialty Healthcare Laboratory",
      orderingPhysician: "Dr. Maya Swaminathan, MD",
      status: "Pending",
      fileSize: "1.8 MB"
    },
    {
      id: "REP-9013",
      patientId: "P-10491",
      fileName: "Hospital_Discharge_Summary_20Aug2026.pdf",
      reportType: "Inpatient Clinical Summary",
      reportDate: "2026-08-20",
      facility: "Valley General Hospital",
      orderingPhysician: "Dr. Marcus Thorne, MD",
      status: "Needs Review",
      fileSize: "3.4 MB"
    },
    {
      id: "REP-9014",
      patientId: "P-10491",
      fileName: "Handwritten_Glucose_Log_12Jul2026.jpg",
      reportType: "Home Device Log",
      reportDate: "2026-07-12",
      facility: "Patient Self-Care Record",
      orderingPhysician: "Self-Reported",
      status: "Pending",
      fileSize: "840 KB"
    },
    {
      id: "REP-9015",
      patientId: "P-10491",
      fileName: "Cardiovascular_Biomarker_Panel_04Sep2026.pdf",
      reportType: "Atherosclerotic Risk Assessment",
      reportDate: "2026-09-04",
      facility: "Heart & Vascular Specialty Institute",
      orderingPhysician: "Dr. Clara Zhang, MD",
      status: "Verified",
      fileSize: "1.4 MB"
    },
    {
      id: "REP-9011",
      patientId: "P-10490",
      fileName: "Obstetric_Ultrasound_Anatomy_Scan_25Aug2026.pdf",
      reportType: "Diagnostic Ultrasound Scan",
      reportDate: "2026-08-25",
      facility: "Advanced Fetal Imaging Center",
      orderingPhysician: "Dr. Maya Swaminathan, MD",
      status: "Verified",
      fileSize: "4.2 MB"
    }
  ],

  labs: [
    {
      id: "LAB-501",
      patientId: "P-10491",
      reportId: "REP-9012",
      sourceDoc: "Comprehensive_Metabolic_Lipid_04Sep2026.pdf",
      testName: "HbA1c",
      value: "7.6",
      unit: "%",
      referenceRange: "4.0 - 5.6",
      hasSourceRange: true,
      status: "High",
      category: "Endocrinology",
      testDate: "2026-09-04",
      confidence: 0.98,
      verificationStatus: "Verified",
      provenance: "SOURCE EXTRACTED"
    },
    {
      id: "LAB-502",
      patientId: "P-10491",
      reportId: "REP-9012",
      sourceDoc: "Comprehensive_Metabolic_Lipid_04Sep2026.pdf",
      testName: "Fasting Blood Glucose",
      value: "148",
      unit: "mg/dL",
      referenceRange: "70 - 99",
      hasSourceRange: true,
      status: "High",
      category: "Endocrinology",
      testDate: "2026-09-04",
      confidence: 0.96,
      verificationStatus: "Pending Review",
      provenance: "SOURCE EXTRACTED"
    },
    {
      id: "LAB-503",
      patientId: "P-10491",
      reportId: "REP-9012",
      sourceDoc: "Comprehensive_Metabolic_Lipid_04Sep2026.pdf",
      testName: "Total Cholesterol",
      value: "218",
      unit: "mg/dL",
      referenceRange: "< 200",
      hasSourceRange: true,
      status: "High",
      category: "Lipid Panel",
      testDate: "2026-09-04",
      confidence: 0.94,
      verificationStatus: "Verified",
      provenance: "SOURCE EXTRACTED"
    },
    {
      id: "LAB-504",
      patientId: "P-10491",
      reportId: "REP-9012",
      sourceDoc: "Comprehensive_Metabolic_Lipid_04Sep2026.pdf",
      testName: "LDL Cholesterol",
      value: "142",
      unit: "mg/dL",
      referenceRange: "< 100",
      hasSourceRange: true,
      status: "High",
      category: "Lipid Panel",
      testDate: "2026-09-04",
      confidence: 0.93,
      verificationStatus: "Verified",
      provenance: "SOURCE EXTRACTED"
    },
    {
      id: "LAB-505",
      patientId: "P-10491",
      reportId: "REP-9014",
      sourceDoc: "Handwritten_Glucose_Log_12Jul2026.jpg",
      testName: "Fasting Blood Glucose (Self-Log)",
      value: "138",
      unit: "Unspecified in source",
      referenceRange: "70 - 100 mg/dL",
      hasSourceRange: true,
      status: "High",
      category: "Home Log",
      testDate: "2026-07-12",
      confidence: 0.52,
      verificationStatus: "Needs Clarification",
      provenance: "SOURCE EXTRACTED"
    },
    {
      id: "LAB-506",
      patientId: "P-10491",
      reportId: "REP-9015",
      sourceDoc: "Cardiovascular_Biomarker_Panel_04Sep2026.pdf",
      testName: "Lipoprotein(a)",
      value: "78",
      unit: "nmol/L",
      referenceRange: "Not provided",
      hasSourceRange: false,
      status: "Cannot determine",
      category: "Cardiovascular",
      testDate: "2026-09-04",
      confidence: 0.88,
      verificationStatus: "Pending Review",
      provenance: "SOURCE EXTRACTED"
    },
    // Ananya Rao Labs
    {
      id: "LAB-401",
      patientId: "P-10490",
      reportId: "REP-9010",
      sourceDoc: "Comprehensive_Antenatal_Panel_01Sep2026.pdf",
      testName: "Hemoglobin",
      value: "10.6",
      unit: "g/dL",
      referenceRange: "11.5 - 15.0",
      hasSourceRange: true,
      status: "Low",
      category: "Hematology",
      testDate: "2026-09-01",
      confidence: 0.97,
      verificationStatus: "Pending Review",
      provenance: "SOURCE EXTRACTED"
    },
    {
      id: "LAB-402",
      patientId: "P-10490",
      reportId: "REP-9010",
      sourceDoc: "Comprehensive_Antenatal_Panel_01Sep2026.pdf",
      testName: "Ferritin",
      value: "12",
      unit: "ng/mL",
      referenceRange: "15 - 150",
      hasSourceRange: true,
      status: "Low",
      category: "Hematology",
      testDate: "2026-09-01",
      confidence: 0.95,
      verificationStatus: "Pending Review",
      provenance: "SOURCE EXTRACTED"
    },
    {
      id: "LAB-403",
      patientId: "P-10490",
      reportId: "REP-9010",
      sourceDoc: "Comprehensive_Antenatal_Panel_01Sep2026.pdf",
      testName: "Platelet Count",
      value: "210",
      unit: "K/uL",
      referenceRange: "150 - 450",
      hasSourceRange: true,
      status: "Normal",
      category: "Hematology",
      testDate: "2026-09-01",
      confidence: 0.96,
      verificationStatus: "Verified",
      provenance: "SOURCE EXTRACTED"
    },
    {
      id: "LAB-404",
      patientId: "P-10490",
      reportId: "REP-9010",
      sourceDoc: "Comprehensive_Antenatal_Panel_01Sep2026.pdf",
      testName: "Fasting Blood Sugar",
      value: "84",
      unit: "mg/dL",
      referenceRange: "70 - 95",
      hasSourceRange: true,
      status: "Normal",
      category: "Endocrinology",
      testDate: "2026-09-01",
      confidence: 0.98,
      verificationStatus: "Verified",
      provenance: "SOURCE EXTRACTED"
    }
  ],

  inconsistencies: [
    {
      id: "INC-101",
      patientId: "P-10491",
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
  ],

  clarifications: [
    {
      id: "CLR-001",
      patientId: "P-10491",
      reportId: "REP-9014",
      title: "Unspecified Measurement Unit on Glucometer Log",
      question: "The handwritten log recorded 'Fasting Blood Sugar: 138' without a measurement unit. Please confirm whether this value was recorded in mg/dL or mmol/L.",
      sourceText: "FBS 138 (device model Accu-Chek)",
      status: "Pending Clarification",
      confidenceScore: "52% OCR Confidence"
    }
  ],

  timeline: [
    {
      id: "EVT-01",
      patientId: "P-10491",
      date: "04 Sep 2026",
      title: "Comprehensive Metabolic & Lipid Testing",
      category: "Laboratory Panel",
      description: "Fast-verified metabolic panel demonstrating elevated HbA1c (7.6%) and dyslipidemia.",
      sourceDoc: "Comprehensive_Metabolic_Lipid_04Sep2026.pdf"
    },
    {
      id: "EVT-02",
      patientId: "P-10491",
      date: "20 Aug 2026",
      title: "Hospital Discharge Following Chest Pressure Evaluation",
      category: "Inpatient Encounter",
      description: "Evaluated at Valley General; cardiac enzymes normal. Discharge orders documented Amlodipine 5mg.",
      sourceDoc: "Hospital_Discharge_Summary_20Aug2026.pdf"
    },
    {
      id: "EVT-03",
      patientId: "P-10491",
      date: "12 Jul 2026",
      title: "Self-Reported Glucometer Log",
      category: "Patient Self-Care",
      description: "Logged fasting glucose 138; handwritten document with low OCR transcription confidence.",
      sourceDoc: "Handwritten_Glucose_Log_12Jul2026.jpg"
    },
    // Ananya Rao Timeline
    {
      id: "EVT-10",
      patientId: "P-10490",
      date: "01 Sep 2026",
      title: "Maternal-Fetal Antenatal Blood Panel",
      category: "Laboratory Panel",
      description: "Evaluated maternal indices at week 24. Hemoglobin 10.6 g/dL and Ferritin 12 ng/mL noted.",
      sourceDoc: "Comprehensive_Antenatal_Panel_01Sep2026.pdf"
    },
    {
      id: "EVT-11",
      patientId: "P-10490",
      date: "25 Aug 2026",
      title: "Obstetric Ultrasound Anatomy Scan",
      category: "Diagnostic Imaging",
      description: "Normal fetal anatomic survey at 23 weeks gestation. Placenta posterior, high.",
      sourceDoc: "Obstetric_Ultrasound_Anatomy_Scan_25Aug2026.pdf"
    }
  ],

  auditLogs: [
    {
      id: "AUD-901",
      timestamp: "2026-09-05T10:15:00Z",
      actor: "Dr. Emily Vance",
      action: "PATIENT_RECORD_INITIALIZED",
      details: "Clinical dossier initialized for Ananya Rao (P-10490)"
    },
    {
      id: "AUD-902",
      timestamp: "2026-09-04T17:30:00Z",
      actor: "Dr. Clara Zhang",
      action: "REPORT_INGESTION_COMPLETED",
      details: "Extracted 4 biomarkers from Comprehensive_Metabolic_Lipid_04Sep2026.pdf"
    },
    {
      id: "AUD-903",
      timestamp: "2026-09-04T17:35:00Z",
      actor: "System Safety Engine",
      action: "CONFLICT_FLAGGED",
      details: "Medication mismatch detected: Telmisartan 40mg vs Amlodipine 5mg"
    }
  ]
};
