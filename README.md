# MediVault AI — Intelligent Healthcare Information Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-emerald.svg)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Clinical_Guardrails-Strictly_Non--Diagnostic-blue.svg)]()

> **Transforming fragmented clinical records into structured, verifiable, and traceable clinical dossiers.**

---

## 🏥 Product Overview

**MediVault AI** is a secure, clinician-in-the-loop healthcare information platform designed to solve the problem of fragmented medical reports. It ingests lab panels, diagnostic tests, hospital discharge summaries, and patient-reported logs, transforming unstructured data into structured clinical records with strict reference range evaluation, conflict detection, and mathematical provenance.

### 🛡️ Core Safety Principles & Guardrails
- **Information Organization Only:** Strictly **non-diagnostic**, non-prescriptive, and does not suggest medication dosage changes.
- **Strict Reference Range Evaluation:** If a diagnostic report includes a reference range, values are evaluated mathematically as `Normal`, `High`, or `Low`. If no range exists in the source report, it is recorded strictly as `"Not provided"` and status marked as `"Cannot determine"` — **never inventing or guessing medical intervals**.
- **Human-in-the-Loop Split-Screen Verification:** AI-extracted parameters are presented side-by-side with original document scans. Clinicians can Verify, Edit (with mandatory reason), or Reject fields before certifying them into the permanent record.
- **Transparent Conflict Detection:** Contradictory records across encounters (e.g. inpatient vs. outpatient medication regimens or age discrepancies) are flagged as `"Needs Human Review"`. The platform never silently decides a winner.
- **Immutable Audit Trail:** Every extraction, clinician verification, edit reason, and conflict dismissal is permanently timestamped.

---

## 🚀 Key Features

1. **Clinical Dashboard & Triage:**
   - Real-time clinical summary with greeting, current patient dossier, and quick patient switcher.
   - 5 high-level statistics cards (Total Patients, Reports Processed, Pending Review, Conflicts Flagged, Recent Labs).
   - "Needs Attention" triage strip highlighting pending verification queues, clinical conflicts, and ambiguity clarifications.
   - Recent Medical Reports table with instant Split-Screen viewer shortcuts.
   - Non-diagnostic AI Clinical Summary synthesis.

2. **Structured Patient Record Hub:**
   - Demographics, vital history, active conditions, documented allergies, and current medications.
   - 4 Header Actions: **Upload Report**, **Edit Patient**, **Generate Summary**, and **Compare Reports**.
   - 6 Navigation Tabs: `Overview`, `Lab Results`, `Medical Reports`, `Timeline`, `AI Summary`, and `Conflicts`.

3. **5-Step Ingestion Pipeline & Unreadable Scan Fallback:**
   - 5 visual stages: `File Uploaded` ➔ `OCR Processing` ➔ `Entity Extraction` ➔ `Range Matching` ➔ `Verification Ready`.
   - Labeled: `"Demo Processing — Not Real AI Extraction"`.
   - Fallback error banner for degraded documents with instant **"Review Manually"** entry.

4. **Split-Screen Human Verification:**
   - Left pane: Rendered source document simulation with clinical letterhead, specimen ID, and OCR highlights.
   - Right pane: Extracted parameters with OCR confidence meters and status badges (`Pending Review`, `Verified`, `Edited`, `Rejected`, `Needs Clarification`).

5. **Longitudinal Comparison & Trend Tracking:**
   - Side-by-side comparison of diagnostic parameters across different dates with delta change calculations.

---

## 🔑 Demo Clinician Accounts

| Account Name | Clinical Role | Email | Password |
| :--- | :--- | :--- | :--- |
| **Dr. Emily Vance** | Care Coordinator & Clinical Reviewer | `emily.vance@medivault.clinic` | `clinician123` |
| **Dr. Marcus Thorne** | Attending Physician | `marcus.thorne@medivault.clinic` | `physician123` |

*Instant 1-Click Demo Login buttons are available on the login modal.*

---

## 📁 Preloaded Clinical Scenarios

1. **Rahul Mehta (`P-10491`, 48 / Male):**
   - **Conditions:** Type 2 Diabetes, Essential Hypertension, Dyslipidemia.
   - **Diagnostic Data:** HbA1c 7.6% (High), Fasting Glucose 148 mg/dL (High), Total Cholesterol 218 mg/dL (High), LDL 142 mg/dL (High).
   - **Safety Scenarios:**
     - Handwritten glucometer log with low OCR confidence (52%).
     - Advanced Cardiovascular Panel with Lipoprotein(a) lacking source range ➔ strictly evaluated as `"Cannot determine"`.
     - Medication conflict: Outpatient Telmisartan 40mg vs Inpatient Discharge Amlodipine 5mg.
     - Age discrepancy: 48 in intake profile vs 49 on discharge face sheet.

2. **Ananya Rao (`P-10490`, 32 / Female):**
   - **Conditions:** Gestational week 24, singleton pregnancy, mild iron deficiency anemia.
   - **Diagnostic Data:** Hemoglobin 10.6 g/dL (Low), Ferritin 12 ng/mL (Low), Platelet Count 210 K/uL (Normal), Fasting Blood Sugar 84 mg/dL (Normal).

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** Clean Vanilla JavaScript (ES6+), Tailwind CSS CDN, Lucide Icons.
- **Backend:** Node.js native HTTP REST API, in-memory relational data store.
- **Architecture:** Zero heavyweight dependencies; lightweight, blazingly fast, and completely portable.

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18 or higher)

### Installation & Launch
```bash
# Clone the repository
git clone https://github.com/kavalimadhumathi-rgb/medical-app.git
cd medical-app

# Start the MediVault AI server
node backend/server.js
```

Open your browser and navigate to:
```
http://localhost:3100
```

---

## 📄 License
This project is licensed under the MIT License.
