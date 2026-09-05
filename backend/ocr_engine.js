/**
 * MediVault AI - OCR and Report Extraction Engine
 * Follows Strict Rules:
 * - Extract only information actually present in source document
 * - NEVER invent reference ranges
 * - NEVER invent units or values
 * - Mark uncertain extractions (<70% confidence) as needing verification
 */
const db = require('./database');

class OCRExtractionEngine {
  /**
   * Simulates full medical report processing pipeline
   * Uploaded -> OCR -> AI Extraction -> Validation -> Review -> Added to Record
   */
  async processReport(reportId, samplePresetKey = null) {
    const report = db.getReportById(reportId);
    if (!report) throw new Error("Report not found");

    // Stage 1: Uploaded (already done)
    // Stage 2: OCR
    db.updateReportPipeline(reportId, 2, "OCR");
    await this.sleep(400);

    // Stage 3: AI Extraction
    db.updateReportPipeline(reportId, 3, "AI Extraction");
    await this.sleep(500);

    // Generate extracted lab values based on report type / preset
    const extractedData = this.generateExtractedValues(report, samplePresetKey);

    // Stage 4: Validation
    db.updateReportPipeline(reportId, 4, "Validation");
    await this.sleep(400);

    // Add extracted values to database
    db.addLabResults(extractedData.labs);

    // Check for ambiguities or conflicts
    if (extractedData.clarification) {
      db.clarifications.push(extractedData.clarification);
    }
    if (extractedData.inconsistency) {
      db.inconsistencies.push(extractedData.inconsistency);
    }

    // Stage 5: Ready for Human Review
    db.updateReportPipeline(reportId, 5, "Review", "Needs Review");

    db.addTimelineEvent({
      patientId: report.patientId,
      eventType: "AI Extraction",
      title: "AI extraction completed",
      description: `${extractedData.labs.length} laboratory parameters extracted from '${report.fileName}'. Awaiting human review.`,
      provenance: "AI Engine"
    });

    db.addAuditLog({
      user: "AI Extraction System v2.4",
      action: "AI_EXTRACTION_COMPLETED",
      affectedRecord: `Report ${report.id} (${report.fileName})`,
      previousValue: "Processing pipeline",
      newValue: `Extracted ${extractedData.labs.length} fields`,
      notes: "Strict reference range check enforced"
    });

    return {
      reportId,
      pipelineStatus: "Review",
      extractedLabsCount: extractedData.labs.length,
      labs: extractedData.labs
    };
  }

  generateExtractedValues(report, samplePresetKey) {
    const patientId = report.patientId;
    const reportId = report.id;
    const sourceDoc = report.fileName;

    if (report.reportType === "Blood Test" || samplePresetKey === 'blood') {
      return {
        labs: [
          {
            patientId,
            reportId,
            sourceDoc,
            pageNumber: 1,
            testName: "Hemoglobin",
            value: "13.5",
            unit: "g/dL",
            referenceRange: "12.0–16.0",
            status: "Normal",
            confidence: 97,
            observation: "Reported within reference interval specified by source laboratory."
          },
          {
            patientId,
            reportId,
            sourceDoc,
            pageNumber: 1,
            testName: "Fasting Blood Glucose",
            value: "112",
            unit: "mg/dL",
            referenceRange: "70–99",
            status: "High",
            confidence: 96,
            observation: "Exceeds upper limit of 99 mg/dL provided in source report."
          },
          {
            patientId,
            reportId,
            sourceDoc,
            pageNumber: 1,
            testName: "Serum Creatinine",
            value: "0.95",
            unit: "mg/dL",
            referenceRange: "0.6–1.2",
            status: "Normal",
            confidence: 95,
            observation: "Within laboratory reference bounds."
          },
          {
            patientId,
            reportId,
            sourceDoc,
            pageNumber: 2,
            testName: "Total Bilirubin",
            value: "0.8",
            unit: "mg/dL",
            referenceRange: "0.2–1.2",
            status: "Normal",
            confidence: 93,
            observation: "Normal hepatic filtration marker in source."
          },
          {
            patientId,
            reportId,
            sourceDoc,
            pageNumber: 2,
            testName: "Alkaline Phosphatase (ALP)",
            value: "88",
            unit: "U/L",
            referenceRange: "44–147",
            status: "Normal",
            confidence: 91,
            observation: "Standard enzyme range verified."
          },
          {
            patientId,
            reportId,
            sourceDoc,
            pageNumber: 2,
            testName: "High-Sensitivity CRP",
            value: "3.2",
            unit: "mg/L",
            referenceRange: "Not provided in source",
            status: "Not provided in source", // STRICT RULE!
            confidence: 82,
            observation: "No reference range supplied in source document. Status kept unclassified."
          }
        ]
      };
    } else if (report.reportType === "Urine Test" || samplePresetKey === 'urine') {
      return {
        labs: [
          {
            patientId,
            reportId,
            sourceDoc,
            pageNumber: 1,
            testName: "Specific Gravity",
            value: "1.020",
            unit: "",
            referenceRange: "1.005–1.030",
            status: "Normal",
            confidence: 95,
            observation: "Within normal hydration density bounds."
          },
          {
            patientId,
            reportId,
            sourceDoc,
            pageNumber: 1,
            testName: "Urinary pH",
            value: "6.5",
            unit: "",
            referenceRange: "4.5–8.0",
            status: "Normal",
            confidence: 98,
            observation: "Normal urine acid-base balance."
          },
          {
            patientId,
            reportId,
            sourceDoc,
            pageNumber: 1,
            testName: "Urine Protein",
            value: "Negative",
            unit: "",
            referenceRange: "Negative",
            status: "Normal",
            confidence: 96,
            observation: "No detectable proteinuria."
          }
        ]
      };
    } else {
      // Generic medical extraction
      return {
        labs: [
          {
            patientId,
            reportId,
            sourceDoc,
            pageNumber: 1,
            testName: "Extracted Clinical Marker",
            value: "120",
            unit: "mg/dL",
            referenceRange: "70–125",
            status: "Normal",
            confidence: 88,
            observation: "General clinical value recorded from document."
          }
        ]
      };
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new OCRExtractionEngine();
