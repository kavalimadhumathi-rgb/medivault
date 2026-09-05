/**
 * MediVault AI - AI Medical Summary Engine
 * STRICT NON-DIAGNOSTIC & NON-PRESCRIPTIVE GUARDRAILS:
 * - Must NOT diagnose diseases
 * - Must NOT recommend treatments
 * - Must NOT recommend medication or dosage changes
 * - Must NOT predict medical outcomes
 * - Must strictly state: "This summary organizes and explains information found in the available records..."
 */
const db = require('./database');

class AISummaryEngine {
  generatePatientSummary(patientId) {
    const patient = db.getPatientById(patientId);
    if (!patient) throw new Error("Patient not found");

    const labs = db.getLabs(patientId);
    const reports = db.getReports(patientId);
    const userProv = patient.userProvided || {};

    // 1. Patient Information
    const patientInfo = `Age: ${patient.age} | Sex: ${patient.sex} | Patient ID: ${patient.id}`;

    // 2. Reported Information
    const symptomsList = (userProv.symptoms || []).map(s => s.text).join(', ');
    const conditionsList = (userProv.conditions || []).map(c => c.text).join(', ');
    const medsList = (userProv.medications || []).map(m => `${m.name} ${m.dosage}`).join(', ');
    const allergiesList = (userProv.allergies || []).map(a => a.allergen).join(', ');

    const reportedInfo = `The patient information provided includes: Symptoms: ${symptomsList || 'None noted'}; Conditions: ${conditionsList || 'None noted'}; Current Medications: ${medsList || 'None reported'}; Allergies: ${allergiesList || 'None documented'}.`;

    // 3. Recent Laboratory Information
    const sortedReports = [...reports].sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));
    const latestReport = sortedReports[0];
    const recentLabInfo = latestReport 
      ? `The latest uploaded report (${latestReport.reportDate}, '${latestReport.fileName}') contains ${labs.filter(l => l.reportId === latestReport.id).length} recorded laboratory parameters from ${latestReport.facility || 'reporting facility'}.`
      : "No medical reports have been uploaded for this patient yet.";

    // 4. Notable Reported Values (values outside source reference range)
    const notableReportedValues = [];
    labs.forEach(l => {
      if (l.status === 'High' || l.status === 'Low') {
        notableReportedValues.push(
          `${l.testName}: ${l.value} ${l.unit} (Source reference range: ${l.referenceRange}; classified as ${l.status} based strictly on source report range on ${l.testDate}).`
        );
      }
    });
    if (notableReportedValues.length === 0) {
      notableReportedValues.push("All extracted laboratory values with source-provided reference ranges are within their respective source bounds.");
    }

    // 5. Missing Information
    const missingInformation = [];
    const missingRanges = labs.filter(l => !l.hasSourceRange || l.referenceRange === "Not provided in source");
    if (missingRanges.length > 0) {
      missingRanges.forEach(m => {
        missingInformation.push(
          `${m.testName} was reported as ${m.value} ${m.unit}, but no reference range was provided in the source report. Status is preserved as 'Not provided in source'.`
        );
      });
    }

    const missingUnits = labs.filter(l => l.unit.toLowerCase().includes("unspecified"));
    if (missingUnits.length > 0) {
      missingUnits.forEach(u => {
        missingInformation.push(
          `${u.testName} recorded value ${u.value} without a specified unit in source document ${u.sourceDoc}.`
        );
      });
    }

    const conflicts = db.getInconsistencies(patientId);
    if (conflicts.length > 0) {
      conflicts.forEach(c => {
        missingInformation.push(
          `${c.title}: ${c.description} (Flagged for human clinical review).`
        );
      });
    }

    if (missingInformation.length === 0) {
      missingInformation.push("No missing reference ranges or conflicting document records detected in current data.");
    }

    // 6. Mandatory Safety Notice
    const safetyNotice = "MediVault AI is an information organization and summarization tool. It does not provide medical diagnosis, treatment recommendations, or medication advice. AI-generated information may contain errors and should be reviewed against the original source documents and, when appropriate, by a qualified healthcare professional.";

    const summaryPayload = {
      generatedAt: new Date().toISOString(),
      content: {
        patientInfo,
        reportedInfo,
        recentLabInfo,
        notableReportedValues,
        missingInformation,
        safetyNotice
      }
    };

    // Store on patient record
    patient.summary = summaryPayload;
    patient.lastUpdated = new Date().toISOString();

    db.addTimelineEvent({
      patientId,
      eventType: "AI Summary",
      title: "Patient-friendly AI summary generated",
      description: "Structured medical summary created following non-diagnostic safety guardrails.",
      provenance: "AI Engine"
    });

    db.addAuditLog({
      user: "AI Summary Engine v2.4",
      action: "SUMMARY_GENERATED",
      affectedRecord: `Patient ${patient.id} (${patient.fullName})`,
      previousValue: "Previous summary",
      newValue: "Generated new structured summary",
      notes: "Strict safety disclaimer appended"
    });

    return summaryPayload;
  }
}

module.exports = new AISummaryEngine();
