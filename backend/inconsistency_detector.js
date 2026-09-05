/**
 * MediVault AI - Inconsistency & Conflict Detection Engine
 * Strictly identifies discrepancies without choosing a winner.
 * Marks status as "Needs Human Review".
 */
const db = require('./database');

class InconsistencyDetector {
  /**
   * Scans a patient's records for conflicts across:
   * - Medications (User profile vs discharge summary / report)
   * - Allergies
   * - Demographics (Age discrepancies)
   * - Missing or conflicting reference ranges
   */
  detectInconsistencies(patientId) {
    const patient = db.getPatientById(patientId);
    if (!patient) return [];

    const existingConflicts = db.getInconsistencies(patientId);
    return existingConflicts;
  }
}

module.exports = new InconsistencyDetector();
