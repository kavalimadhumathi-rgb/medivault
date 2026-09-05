/**
 * MediVault AI - In-Memory & Relational Model Store (Prompt 2 MVP)
 */
const demo = require('./demo_data');

class Database {
  constructor() {
    this.users = JSON.parse(JSON.stringify(demo.DEMO_USERS));
    this.patients = JSON.parse(JSON.stringify(demo.DEMO_PATIENTS));
    this.reports = JSON.parse(JSON.stringify(demo.DEMO_REPORTS));
    this.labs = JSON.parse(JSON.stringify(demo.DEMO_LAB_RESULTS));
    this.inconsistencies = JSON.parse(JSON.stringify(demo.DEMO_INCONSISTENCIES));
    this.clarifications = JSON.parse(JSON.stringify(demo.DEMO_CLARIFICATIONS));
    this.timeline = JSON.parse(JSON.stringify(demo.DEMO_TIMELINE_EVENTS));
    this.auditLogs = JSON.parse(JSON.stringify(demo.DEMO_AUDIT_LOGS));
    this.resetTokens = {}; // email -> token
  }

  // --- 1. AUTHENTICATION ---
  findUserByEmail(email) {
    if (!email) return null;
    return this.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  }

  findUserByToken(token) {
    if (!token) return null;
    return this.users.find(u => u.token === token) || null;
  }

  signup({ name, email, password, role }) {
    const existing = this.findUserByEmail(email);
    if (existing) {
      throw new Error("A user account with this email already exists.");
    }

    const newUser = {
      id: "USR-" + Math.floor(100 + Math.random() * 900),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: role || "Clinical Reviewer",
      facility: "Metropolitan Healthcare Center",
      token: "token_" + Math.random().toString(36).substr(2) + Date.now(),
      created_at: new Date().toISOString()
    };

    this.users.push(newUser);
    return newUser;
  }

  login(email, password) {
    const user = this.findUserByEmail(email);
    if (!user || user.password !== password) {
      throw new Error("Invalid email or password.");
    }
    user.token = "token_" + Math.random().toString(36).substr(2) + Date.now();
    return user;
  }

  forgotPassword(email) {
    const user = this.findUserByEmail(email);
    if (!user) {
      throw new Error("No account found with this email address.");
    }
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    this.resetTokens[user.email] = { token, expiresAt: Date.now() + 15 * 60 * 1000 };
    return { success: true, message: "Reset code generated", code: token };
  }

  resetPassword(email, token, newPassword) {
    const user = this.findUserByEmail(email);
    if (!user) throw new Error("User not found.");
    
    const record = this.resetTokens[user.email];
    if (!record || record.token !== token.trim() || record.expiresAt < Date.now()) {
      throw new Error("Invalid or expired password reset code.");
    }

    user.password = newPassword;
    delete this.resetTokens[user.email];
    return { success: true, message: "Password reset successfully. You can now login." };
  }

  // --- 2. CRITICAL REFERENCE RANGE RULE ---
  /**
   * Evaluates a numeric value strictly against a source reference range string.
   * If source has no range:
   *   referenceRange: "Not provided", status: "Cannot determine"
   * NEVER invents or uses generic medical databases.
   */
  evaluateReferenceRange(value, rangeStr) {
    if (!rangeStr || 
        rangeStr.toLowerCase().includes("not provided") || 
        rangeStr.toLowerCase().includes("not established") ||
        rangeStr.trim() === "") {
      return {
        referenceRange: "Not provided",
        status: "Cannot determine",
        hasSourceRange: false
      };
    }

    const cleanRange = rangeStr.trim();
    const num = parseFloat(value);
    if (isNaN(num)) {
      // Qualitative comparison (e.g. Negative)
      if (cleanRange.toLowerCase() === 'negative') {
        const isNeg = String(value).toLowerCase().includes('negative');
        return {
          referenceRange: cleanRange,
          status: isNeg ? "Normal" : "High",
          hasSourceRange: true
        };
      }
      return {
        referenceRange: cleanRange,
        status: "Normal",
        hasSourceRange: true
      };
    }

    // Range like "< 200" or "<100"
    if (cleanRange.startsWith("<")) {
      const max = parseFloat(cleanRange.replace("<", "").trim());
      return {
        referenceRange: cleanRange,
        status: num < max ? "Normal" : "High",
        hasSourceRange: true
      };
    }

    // Range like "> 40" or ">40"
    if (cleanRange.startsWith(">")) {
      const min = parseFloat(cleanRange.replace(">", "").trim());
      return {
        referenceRange: cleanRange,
        status: num > min ? "Normal" : "Low",
        hasSourceRange: true
      };
    }

    // Range with delimiter: "12-16", "12.0 - 16.0", "12–16", "70-100"
    const match = cleanRange.match(/([0-9.]+)\s*[-–—to]+\s*([0-9.]+)/i);
    if (match) {
      const min = parseFloat(match[1]);
      const max = parseFloat(match[2]);
      let status = "Normal";
      if (num < min) status = "Low";
      else if (num > max) status = "High";

      return {
        referenceRange: cleanRange,
        status,
        hasSourceRange: true
      };
    }

    // Unparseable range
    return {
      referenceRange: cleanRange,
      status: "Cannot determine",
      hasSourceRange: true
    };
  }

  // --- 3. PATIENTS ---
  getPatients(searchQuery = '', filters = {}) {
    let list = [...this.patients];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        (p.fullName && p.fullName.toLowerCase().includes(q)) ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q))
      );
    }
    if (filters.sex) {
      list = list.filter(p => p.sex.toLowerCase() === filters.sex.toLowerCase());
    }
    if (filters.verificationStatus) {
      list = list.filter(p => p.verificationStatus.toLowerCase() === filters.verificationStatus.toLowerCase());
    }
    return list;
  }

  getPatientById(id) {
    return this.patients.find(p => p.id === id || p.patient_id === id) || null;
  }

  createPatient(patientData) {
    const id = patientData.patient_id || ("P-" + Math.floor(10000 + Math.random() * 90000));
    const newPatient = {
      id,
      patient_id: id,
      fullName: patientData.fullName || patientData.name || "Unnamed Patient",
      name: patientData.fullName || patientData.name || "Unnamed Patient",
      dob: patientData.dob || patientData.date_of_birth || "1985-01-01",
      date_of_birth: patientData.dob || patientData.date_of_birth || "1985-01-01",
      age: patientData.age || 40,
      sex: patientData.sex || "Other",
      phone: patientData.phone || patientData.contact || "",
      email: patientData.email || "",
      emergencyContact: patientData.emergencyContact || { name: "", relation: "", phone: "" },
      userProvided: {
        symptoms: (patientData.userProvided?.symptoms || []).map(s => ({ ...s, source: "USER PROVIDED" })),
        conditions: (patientData.userProvided?.conditions || []).map(c => ({ ...c, source: "USER PROVIDED" })),
        allergies: (patientData.userProvided?.allergies || []).map(a => ({ ...a, source: "USER PROVIDED" })),
        medications: (patientData.userProvided?.medications || []).map(m => ({ ...m, source: "USER PROVIDED" })),
        procedures: (patientData.userProvided?.procedures || []).map(p => ({ ...p, source: "USER PROVIDED" })),
        medicalHistory: patientData.userProvided?.medicalHistory || "",
        familyHistory: patientData.userProvided?.familyHistory || ""
      },
      reportCount: 0,
      lastUpdated: new Date().toISOString(),
      verificationStatus: "Verified",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      summary: null
    };

    this.patients.unshift(newPatient);

    this.addTimelineEvent({
      patientId: id,
      eventType: "Intake",
      title: "Patient created",
      description: `Patient ${newPatient.fullName} (${newPatient.id}) registered in vault.`,
      provenance: "USER PROVIDED"
    });

    this.addAuditLog({
      user: "Dr. Emily Vance",
      user_id: "USR-001",
      patient_id: id,
      action: "PATIENT_CREATED",
      affectedRecord: `Patient ${newPatient.id} (${newPatient.fullName})`,
      previous_value: "None",
      new_value: "Registered new patient record",
      notes: "Every entry tagged strictly as USER PROVIDED"
    });

    return newPatient;
  }

  updatePatientFull(id, updateData, user = "Dr. Emily Vance") {
    const patient = this.getPatientById(id);
    if (!patient) return null;

    const prevSummary = `Phone: ${patient.phone}, Symptoms: ${patient.userProvided?.symptoms?.length || 0}, Meds: ${patient.userProvided?.medications?.length || 0}`;

    if (updateData.fullName) patient.fullName = patient.name = updateData.fullName;
    if (updateData.dob) patient.dob = patient.date_of_birth = updateData.dob;
    if (updateData.age) patient.age = updateData.age;
    if (updateData.sex) patient.sex = updateData.sex;
    if (updateData.phone) patient.phone = updateData.phone;
    if (updateData.email) patient.email = updateData.email;
    if (updateData.emergencyContact) patient.emergencyContact = updateData.emergencyContact;

    if (updateData.userProvided) {
      patient.userProvided = {
        symptoms: (updateData.userProvided.symptoms || []).map(s => ({ ...s, source: "USER PROVIDED" })),
        conditions: (updateData.userProvided.conditions || []).map(c => ({ ...c, source: "USER PROVIDED" })),
        allergies: (updateData.userProvided.allergies || []).map(a => ({ ...a, source: "USER PROVIDED" })),
        medications: (updateData.userProvided.medications || []).map(m => ({ ...m, source: "USER PROVIDED" })),
        procedures: (updateData.userProvided.procedures || []).map(p => ({ ...p, source: "USER PROVIDED" })),
        medicalHistory: updateData.userProvided.medicalHistory || "",
        familyHistory: updateData.userProvided.familyHistory || ""
      };
    }

    patient.lastUpdated = patient.updated_at = new Date().toISOString();

    const newSummary = `Phone: ${patient.phone}, Symptoms: ${patient.userProvided?.symptoms?.length || 0}, Meds: ${patient.userProvided?.medications?.length || 0}`;

    this.addAuditLog({
      user: user.name || user,
      user_id: user.id || "USR-001",
      patient_id: id,
      action: "PATIENT_EDITED",
      affectedRecord: `Patient ${patient.id} (${patient.fullName})`,
      previous_value: prevSummary,
      new_value: newSummary,
      notes: "Demographics / clinical baseline updated by authorized user"
    });

    return patient;
  }

  deletePatient(id) {
    const patient = this.getPatientById(id);
    if (!patient) return false;
    this.patients = this.patients.filter(p => p.id !== id && p.patient_id !== id);
    this.reports = this.reports.filter(r => r.patientId !== id && r.patient_id !== id);
    this.labs = this.labs.filter(l => l.patientId !== id && l.patient_id !== id);
    this.inconsistencies = this.inconsistencies.filter(i => i.patientId !== id && i.patient_id !== id);
    this.clarifications = this.clarifications.filter(c => c.patientId !== id && c.patient_id !== id);
    this.timeline = this.timeline.filter(t => t.patientId !== id && t.patient_id !== id);

    this.addAuditLog({
      user: "Dr. Emily Vance",
      user_id: "USR-001",
      patient_id: id,
      action: "PATIENT_DELETED",
      affectedRecord: `Patient ${id} (${patient.fullName})`,
      previous_value: "Active Patient Record",
      new_value: "Permanently Purged",
      notes: "Right to erasure executed"
    });

    return true;
  }

  // --- 4. MEDICAL REPORTS ---
  getReports(patientId) {
    if (patientId) {
      return this.reports.filter(r => r.patientId === patientId || r.patient_id === patientId);
    }
    return this.reports;
  }

  getReportById(id) {
    return this.reports.find(r => r.id === id) || null;
  }

  addReport(reportData) {
    const id = "REP-" + Math.floor(9000 + Math.random() * 9000);
    const newReport = {
      id,
      patientId: reportData.patientId || reportData.patient_id,
      patient_id: reportData.patientId || reportData.patient_id,
      fileName: reportData.fileName || reportData.file_name || "medical_report.pdf",
      file_name: reportData.fileName || reportData.file_name || "medical_report.pdf",
      fileSize: reportData.fileSize || "1.2 MB",
      fileType: reportData.fileType || "application/pdf",
      reportType: reportData.reportType || reportData.report_type || "Blood Test",
      report_type: reportData.reportType || reportData.report_type || "Blood Test",
      reportDate: reportData.reportDate || reportData.report_date || new Date().toISOString().split('T')[0],
      report_date: reportData.reportDate || reportData.report_date || new Date().toISOString().split('T')[0],
      file_url: `/uploads/${id}_${reportData.fileName || 'report.pdf'}`,
      uploadedAt: new Date().toISOString(),
      uploaded_at: new Date().toISOString(),
      facility: reportData.facility || "Diagnostic Pathology Services",
      orderingPhysician: reportData.orderingPhysician || "Attending Physician",
      pipelineStatus: reportData.pipelineStatus || "Review",
      processing_status: reportData.pipelineStatus || "Review",
      pipelineStep: reportData.pipelineStep || 5,
      verificationStatus: "Pending Review",
      pageCount: reportData.pageCount || 1,
      rawTextSnippet: reportData.rawTextSnippet || ""
    };

    this.reports.unshift(newReport);

    const p = this.getPatientById(newReport.patientId);
    if (p) {
      p.reportCount = (p.reportCount || 0) + 1;
      p.lastUpdated = new Date().toISOString();
      p.verificationStatus = "Pending Review";
    }

    this.addTimelineEvent({
      patientId: newReport.patientId,
      eventType: "Upload",
      title: "Blood report uploaded",
      description: `File '${newReport.fileName}' (${newReport.reportType}) uploaded.`,
      provenance: "User Action"
    });

    this.addAuditLog({
      user: "Dr. Emily Vance",
      user_id: "USR-001",
      patient_id: newReport.patientId,
      action: "REPORT_UPLOADED",
      affectedRecord: `Report ${newReport.id} (${newReport.fileName})`,
      previous_value: "None",
      new_value: `Uploaded ${newReport.reportType} (${newReport.fileSize})`,
      notes: "Uploaded to secure vault"
    });

    return newReport;
  }

  // --- 5. EXTRACTED LAB RESULTS ---
  getLabs(patientId, reportId) {
    let list = [...this.labs];
    if (patientId) list = list.filter(l => l.patientId === patientId || l.patient_id === patientId);
    if (reportId) list = list.filter(l => l.reportId === reportId || l.report_id === reportId);
    return list;
  }

  getLabById(id) {
    return this.labs.find(l => l.id === id) || null;
  }

  addLabResults(results) {
    const created = [];
    results.forEach(r => {
      const id = "LAB-" + Math.floor(1000 + Math.random() * 9000);
      const evalRange = this.evaluateReferenceRange(r.value, r.referenceRange || r.reference_range);
      
      const newLab = {
        id,
        patientId: r.patientId || r.patient_id,
        patient_id: r.patientId || r.patient_id,
        reportId: r.reportId || r.report_id,
        report_id: r.reportId || r.report_id,
        sourceDoc: r.sourceDoc || "Document.pdf",
        source_page: r.source_page || r.pageNumber || 1,
        pageNumber: r.source_page || r.pageNumber || 1,
        test_name: r.testName || r.test_name,
        testName: r.testName || r.test_name,
        value: String(r.value),
        numericValue: parseFloat(r.value) || null,
        unit: r.unit || "",
        reference_range: evalRange.referenceRange,
        referenceRange: evalRange.referenceRange,
        hasSourceRange: evalRange.hasSourceRange,
        status: evalRange.status,
        testDate: r.testDate || r.date || new Date().toISOString().split('T')[0],
        observation: r.observation || "",
        confidence: r.confidence !== undefined ? r.confidence : 0.95,
        verification_status: r.confidence < 0.7 ? "Needs Clarification" : (r.verificationStatus || "Pending Review"),
        verificationStatus: r.confidence < 0.7 ? "Needs Clarification" : (r.verificationStatus || "Pending Review"),
        verified_by: null,
        verified_at: null,
        provenanceBadge: "SOURCE EXTRACTED"
      };
      this.labs.push(newLab);
      created.push(newLab);
    });

    return created;
  }

  verifyLabResult(id, action, updatedFields = {}, reviewer = "Dr. Emily Vance", reason = "") {
    const lab = this.getLabById(id);
    if (!lab) return null;

    const prevStatus = lab.verificationStatus;
    const prevVal = `${lab.testName}: ${lab.value} ${lab.unit} [Ref: ${lab.referenceRange}] Status: ${lab.status}`;

    if (action === 'ACCEPT') {
      lab.verificationStatus = lab.verification_status = "Verified";
      lab.verified_by = reviewer.name || reviewer;
      lab.verified_at = new Date().toISOString();
    } else if (action === 'EDIT') {
      lab.value = updatedFields.value !== undefined ? String(updatedFields.value) : lab.value;
      lab.numericValue = parseFloat(lab.value) || null;
      lab.unit = updatedFields.unit !== undefined ? updatedFields.unit : lab.unit;
      
      const evalRange = this.evaluateReferenceRange(lab.value, updatedFields.referenceRange !== undefined ? updatedFields.referenceRange : lab.referenceRange);
      lab.referenceRange = lab.reference_range = evalRange.referenceRange;
      lab.hasSourceRange = evalRange.hasSourceRange;
      lab.status = updatedFields.status !== undefined ? updatedFields.status : evalRange.status;
      
      lab.verificationStatus = lab.verification_status = "Edited";
      lab.verified_by = reviewer.name || reviewer;
      lab.verified_at = new Date().toISOString();
    } else if (action === 'REJECT') {
      lab.verificationStatus = lab.verification_status = "Rejected";
      lab.verified_by = reviewer.name || reviewer;
      lab.verified_at = new Date().toISOString();
    } else if (action === 'NEEDS_CLARIFICATION') {
      lab.verificationStatus = lab.verification_status = "Needs Clarification";
    }

    const newVal = `${lab.testName}: ${lab.value} ${lab.unit} [Ref: ${lab.referenceRange}] Status: ${lab.status} (${lab.verificationStatus})`;

    this.addTimelineEvent({
      patientId: lab.patientId,
      eventType: "Verification",
      title: `${lab.testName} ${lab.verificationStatus.toLowerCase()}`,
      description: `Field ${lab.testName} set to '${lab.verificationStatus}' by ${reviewer.name || reviewer}.`,
      provenance: "User Action"
    });

    this.addAuditLog({
      user: reviewer.name || reviewer,
      user_id: reviewer.id || "USR-001",
      patient_id: lab.patientId,
      action: action === 'ACCEPT' ? "VALUE_VERIFIED" : action === 'EDIT' ? "VALUE_EDITED" : "VALUE_REJECTED",
      affectedRecord: `${lab.testName} (${lab.id})`,
      previous_value: prevVal,
      new_value: newVal,
      notes: reason ? `Reason: ${reason}` : `Reviewed against source document ${lab.sourceDoc}`
    });

    return lab;
  }

  // --- 6. CONFLICTS & INCONSISTENCIES ---
  getInconsistencies(patientId) {
    if (patientId) return this.inconsistencies.filter(i => i.patientId === patientId || i.patient_id === patientId);
    return this.inconsistencies;
  }

  resolveInconsistency(id, resolution, user = "Dr. Emily Vance") {
    const item = this.inconsistencies.find(i => i.id === id);
    if (!item) return null;
    item.status = "Resolved";
    item.resolution = resolution;
    item.resolvedAt = new Date().toISOString();
    item.resolvedBy = user.name || user;

    this.addAuditLog({
      user: user.name || user,
      user_id: user.id || "USR-001",
      patient_id: item.patientId,
      action: "INCONSISTENCY_RESOLVED",
      affectedRecord: `Conflict ${item.id} (${item.title})`,
      previous_value: "Needs Human Review",
      new_value: `Resolved: ${resolution}`,
      notes: "Clinical review decision recorded"
    });

    return item;
  }

  dismissInconsistency(id, user = "Dr. Emily Vance", reason = "Clinically evaluated as not impacting current regimen") {
    const item = this.inconsistencies.find(i => i.id === id);
    if (!item) return null;
    item.status = "Dismissed";
    item.dismissedAt = new Date().toISOString();
    item.dismissedBy = user.name || user;
    item.dismissReason = reason;

    this.addAuditLog({
      user: user.name || user,
      user_id: user.id || "USR-001",
      patient_id: item.patientId,
      action: "INCONSISTENCY_DISMISSED",
      affectedRecord: `Conflict ${item.id} (${item.title})`,
      previous_value: "Needs Human Review",
      new_value: `Dismissed: ${reason}`,
      notes: "Dismissed by reviewer after clinical verification"
    });

    return item;
  }

  // --- 7. TIMELINE & AUDIT ---
  getTimeline(patientId) {
    if (patientId) return this.timeline.filter(t => t.patientId === patientId || t.patient_id === patientId);
    return this.timeline;
  }

  addTimelineEvent(event) {
    const newEvent = {
      id: "EVT-" + Math.floor(1000 + Math.random() * 9000),
      patientId: event.patientId,
      timestamp: new Date().toISOString(),
      dateFormatted: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      eventType: event.eventType || "System",
      title: event.title,
      description: event.description,
      provenance: event.provenance || "System"
    };
    this.timeline.unshift(newEvent);
    return newEvent;
  }

  getAuditLogs(filter = '') {
    if (!filter) return this.auditLogs;
    const q = filter.toLowerCase();
    return this.auditLogs.filter(a => 
      a.action.toLowerCase().includes(q) ||
      a.user.toLowerCase().includes(q) ||
      a.affectedRecord.toLowerCase().includes(q)
    );
  }

  addAuditLog(entry) {
    const newLog = {
      id: "AUD-" + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString(),
      user: entry.user || "Dr. Emily Vance",
      user_id: entry.user_id || "USR-001",
      patient_id: entry.patient_id || null,
      action: entry.action || "RECORD_UPDATED",
      affectedRecord: entry.affectedRecord || "Patient Record",
      previous_value: entry.previous_value || entry.previousValue || "N/A",
      new_value: entry.new_value || entry.newValue || "N/A",
      notes: entry.notes || ""
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }
}

module.exports = new Database();
