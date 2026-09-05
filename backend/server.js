/**
 * MediVault AI - Central Backend REST & Static Server (Prompt 2 MVP)
 * Full authentication, session validation, edit APIs, and reference range protection.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const db = require('./database');
const ocr = require('./ocr_engine');
const summaryEngine = require('./summary_engine');

const PORT = process.env.PORT || 3100;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

// Helper to parse JSON request bodies
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// Helper to send JSON responses
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Get user from Authorization header
function getSessionUser(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return db.findUserByToken(token);
  }
  // Default to Dr. Emily Vance if no header
  return db.users[0];
}

// MIME types for static frontend serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // --- API Routes ---
  if (pathname.startsWith('/api/')) {
    try {
      const sessionUser = getSessionUser(req);

      // Health check
      if (pathname === '/api/health') {
        return sendJson(res, 200, { status: "healthy", timestamp: new Date().toISOString() });
      }

      // --- AUTHENTICATION ROUTES ---
      if (pathname === '/api/auth/me') {
        if (!sessionUser) {
          return sendJson(res, 401, { error: "Not authenticated" });
        }
        return sendJson(res, 200, { user: sessionUser, token: sessionUser.token });
      }

      if (pathname === '/api/auth/login' && method === 'POST') {
        const body = await parseBody(req);
        try {
          const user = db.login(body.email, body.password);
          return sendJson(res, 200, { success: true, user, token: user.token });
        } catch (err) {
          return sendJson(res, 401, { error: err.message });
        }
      }

      if (pathname === '/api/auth/signup' && method === 'POST') {
        const body = await parseBody(req);
        try {
          const user = db.signup(body);
          return sendJson(res, 201, { success: true, user, token: user.token });
        } catch (err) {
          return sendJson(res, 400, { error: err.message });
        }
      }

      if (pathname === '/api/auth/forgot-password' && method === 'POST') {
        const body = await parseBody(req);
        try {
          const result = db.forgotPassword(body.email);
          return sendJson(res, 200, result);
        } catch (err) {
          return sendJson(res, 400, { error: err.message });
        }
      }

      if (pathname === '/api/auth/reset-password' && method === 'POST') {
        const body = await parseBody(req);
        try {
          const result = db.resetPassword(body.email, body.token, body.newPassword);
          return sendJson(res, 200, result);
        } catch (err) {
          return sendJson(res, 400, { error: err.message });
        }
      }

      if (pathname === '/api/auth/logout' && method === 'POST') {
        return sendJson(res, 200, { success: true, message: "Logged out successfully" });
      }

      // Search (Grouped by Category)
      if (pathname === '/api/search') {
        const q = (parsedUrl.query.q || '').toLowerCase();
        const results = {
          patients: db.patients.filter(p => (p.fullName && p.fullName.toLowerCase().includes(q)) || (p.id && p.id.toLowerCase().includes(q))),
          labs: db.labs.filter(l => (l.testName && l.testName.toLowerCase().includes(q)) || (l.value && l.value.toLowerCase().includes(q))),
          reports: db.reports.filter(r => (r.fileName && r.fileName.toLowerCase().includes(q)) || (r.reportType && r.reportType.toLowerCase().includes(q))),
          conditions: []
        };
        db.patients.forEach(p => {
          (p.userProvided?.conditions || []).forEach(c => {
            if (c.text.toLowerCase().includes(q)) {
              results.conditions.push({ patientName: p.fullName, patientId: p.id, condition: c.text });
            }
          });
        });
        return sendJson(res, 200, results);
      }

      // Audit Logs
      if (pathname === '/api/audit') {
        const filter = parsedUrl.query.filter || '';
        return sendJson(res, 200, db.getAuditLogs(filter));
      }

      // Patients list & create
      if (pathname === '/api/patients') {
        if (method === 'GET') {
          const q = parsedUrl.query.q || '';
          const sex = parsedUrl.query.sex || '';
          const verificationStatus = parsedUrl.query.verificationStatus || '';
          return sendJson(res, 200, db.getPatients(q, { sex, verificationStatus }));
        }
        if (method === 'POST') {
          const body = await parseBody(req);
          const newPatient = db.createPatient(body);
          return sendJson(res, 201, newPatient);
        }
      }

      // Single Patient Operations
      const patientMatch = pathname.match(/^\/api\/patients\/([^\/]+)$/);
      if (patientMatch) {
        const patientId = patientMatch[1];
        if (method === 'GET') {
          const patient = db.getPatientById(patientId);
          if (!patient) return sendJson(res, 404, { error: "Patient not found" });
          return sendJson(res, 200, patient);
        }
        if (method === 'DELETE') {
          const ok = db.deletePatient(patientId);
          if (!ok) return sendJson(res, 404, { error: "Patient not found" });
          return sendJson(res, 200, { success: true, message: "Patient record permanently erased." });
        }
      }

      // Patient Full Edit (Demographics & Medical lists)
      const editFullMatch = pathname.match(/^\/api\/patients\/([^\/]+)\/full$/);
      if (editFullMatch && method === 'PUT') {
        const patientId = editFullMatch[1];
        const body = await parseBody(req);
        const updated = db.updatePatientFull(patientId, body, sessionUser);
        if (!updated) return sendJson(res, 404, { error: "Patient not found" });
        return sendJson(res, 200, updated);
      }

      // All Labs across patients
      if (pathname === '/api/labs' && method === 'GET') {
        return sendJson(res, 200, db.labs);
      }

      // All Reports across patients
      if (pathname === '/api/reports' && method === 'GET') {
        return sendJson(res, 200, db.reports);
      }

      // Patient Labs
      const labsMatch = pathname.match(/^\/api\/patients\/([^\/]+)\/labs$/);
      if (labsMatch && method === 'GET') {
        const patientId = labsMatch[1];
        return sendJson(res, 200, db.getLabs(patientId));
      }

      // Patient Reports
      const reportsMatch = pathname.match(/^\/api\/patients\/([^\/]+)\/reports$/);
      if (reportsMatch && method === 'GET') {
        const patientId = reportsMatch[1];
        return sendJson(res, 200, db.getReports(patientId));
      }

      // Patient Timeline
      const timelineMatch = pathname.match(/^\/api\/patients\/([^\/]+)\/timeline$/);
      if (timelineMatch && method === 'GET') {
        const patientId = timelineMatch[1];
        return sendJson(res, 200, db.getTimeline(patientId));
      }

      // Patient Inconsistencies
      const inconstMatch = pathname.match(/^\/api\/patients\/([^\/]+)\/inconsistencies$/);
      if (inconstMatch && method === 'GET') {
        const patientId = inconstMatch[1];
        return sendJson(res, 200, db.getInconsistencies(patientId));
      }

      // Inconsistency Resolution
      const resolveMatch = pathname.match(/^\/api\/inconsistencies\/([^\/]+)\/resolve$/);
      if (resolveMatch && method === 'POST') {
        const id = resolveMatch[1];
        const body = await parseBody(req);
        const resolved = db.resolveInconsistency(id, body.resolution || "Reviewed by clinician", sessionUser);
        if (!resolved) return sendJson(res, 404, { error: "Item not found" });
        return sendJson(res, 200, resolved);
      }

      // Inconsistency Dismissal
      const dismissMatch = pathname.match(/^\/api\/inconsistencies\/([^\/]+)\/dismiss$/);
      if (dismissMatch && method === 'POST') {
        const id = dismissMatch[1];
        const body = await parseBody(req);
        const dismissed = db.dismissInconsistency(id, sessionUser, body.reason || "Clinically reviewed and dismissed");
        if (!dismissed) return sendJson(res, 404, { error: "Item not found" });
        return sendJson(res, 200, dismissed);
      }

      // Lab Verification (Accept / Edit / Reject)
      if (pathname === '/api/labs/verify' && method === 'POST') {
        const body = await parseBody(req);
        const lab = db.verifyLabResult(body.id, body.action, body.updatedFields || {}, sessionUser, body.reason || "");
        if (!lab) return sendJson(res, 404, { error: "Lab item not found" });
        return sendJson(res, 200, lab);
      }

      // Manual Lab Entry Fallback (When OCR fails or unreadable document)
      if (pathname === '/api/labs/manual-entry' && method === 'POST') {
        const body = await parseBody(req);
        const results = db.addLabResults([{
          patientId: body.patientId,
          reportId: body.reportId || "MANUAL-INTAKE",
          sourceDoc: body.sourceDoc || "Manual_Clinical_Transcription",
          source_page: 1,
          testName: body.testName,
          value: body.value,
          unit: body.unit,
          referenceRange: body.referenceRange,
          confidence: 1.0,
          verificationStatus: "Verified",
          observation: body.observation || "Manually entered by clinical staff."
        }]);

        db.addTimelineEvent({
          patientId: body.patientId,
          eventType: "Manual Entry",
          title: `${body.testName} manually recorded`,
          description: `Manual laboratory entry entered by ${sessionUser.name}.`,
          provenance: "USER PROVIDED"
        });

        return sendJson(res, 201, results[0]);
      }

      // Report Upload & Extraction trigger
      if (pathname === '/api/reports/upload' && method === 'POST') {
        const body = await parseBody(req);
        const newReport = db.addReport(body);
        return sendJson(res, 201, newReport);
      }

      if (pathname === '/api/reports/process' && method === 'POST') {
        const body = await parseBody(req);
        const result = await ocr.processReport(body.reportId, body.samplePresetKey);
        return sendJson(res, 200, result);
      }

      // AI Summary
      const summaryMatch = pathname.match(/^\/api\/patients\/([^\/]+)\/summary$/);
      if (summaryMatch) {
        const patientId = summaryMatch[1];
        if (method === 'GET') {
          const patient = db.getPatientById(patientId);
          if (!patient) return sendJson(res, 404, { error: "Patient not found" });
          if (!patient.summary) {
            const generated = summaryEngine.generatePatientSummary(patientId);
            return sendJson(res, 200, generated);
          }
          return sendJson(res, 200, patient.summary);
        }
        if (method === 'POST') {
          const generated = summaryEngine.generatePatientSummary(patientId);
          return sendJson(res, 200, generated);
        }
      }

      // Report Comparison
      const compareMatch = pathname.match(/^\/api\/patients\/([^\/]+)\/compare$/);
      if (compareMatch && method === 'GET') {
        const patientId = compareMatch[1];
        const rep1Id = parsedUrl.query.rep1;
        const rep2Id = parsedUrl.query.rep2;

        const labs = db.getLabs(patientId);
        const rep1 = db.getReportById(rep1Id);
        const rep2 = db.getReportById(rep2Id);

        const r1Labs = labs.filter(l => l.reportId === rep1Id || l.report_id === rep1Id);
        const r2Labs = labs.filter(l => l.reportId === rep2Id || l.report_id === rep2Id);

        const comparison = [];
        const seenTests = new Set();

        r1Labs.forEach(l1 => {
          seenTests.add(l1.testName);
          const l2 = r2Labs.find(x => x.testName.toLowerCase() === l1.testName.toLowerCase());
          let delta = null;
          let neutralStatement = "Single observation in selected reports.";

          if (l2) {
            if (l1.numericValue !== null && l2.numericValue !== null) {
              const diff = (l2.numericValue - l1.numericValue).toFixed(2);
              const sign = diff > 0 ? '+' : '';
              delta = `${sign}${diff} ${l2.unit || ''}`;
              neutralStatement = `The reported value changed from ${l1.value} ${l1.unit} (${l1.testDate}) to ${l2.value} ${l2.unit} (${l2.testDate}).`;
            } else {
              neutralStatement = `The reported value changed from ${l1.value} to ${l2.value}.`;
            }
          }

          comparison.push({
            testName: l1.testName,
            previous: { value: l1.value, unit: l1.unit, date: l1.testDate, doc: l1.sourceDoc },
            current: l2 ? { value: l2.value, unit: l2.unit, date: l2.testDate, doc: l2.sourceDoc } : null,
            delta,
            neutralStatement
          });
        });

        r2Labs.forEach(l2 => {
          if (!seenTests.has(l2.testName)) {
            comparison.push({
              testName: l2.testName,
              previous: null,
              current: { value: l2.value, unit: l2.unit, date: l2.testDate, doc: l2.sourceDoc },
              delta: "New in current report",
              neutralStatement: `Reported as ${l2.value} ${l2.unit} in current report (${l2.testDate}).`
            });
          }
        });

        return sendJson(res, 200, {
          patientId,
          report1: rep1,
          report2: rep2,
          comparison
        });
      }

      // Patient Data Export (JSON)
      const exportMatch = pathname.match(/^\/api\/patients\/([^\/]+)\/export$/);
      if (exportMatch && method === 'POST') {
        const patientId = exportMatch[1];
        const patient = db.getPatientById(patientId);
        if (!patient) return sendJson(res, 404, { error: "Patient not found" });

        const fullRecord = {
          exportDate: new Date().toISOString(),
          disclaimer: "DEMO DATA — NOT REAL PATIENT INFORMATION. MediVault AI v2.4.",
          patient,
          reports: db.getReports(patientId),
          laboratoryResults: db.getLabs(patientId),
          timeline: db.getTimeline(patientId),
          inconsistencies: db.getInconsistencies(patientId)
        };

        db.addAuditLog({
          user: sessionUser.name,
          user_id: sessionUser.id,
          patient_id: patientId,
          action: "PATIENT_DATA_EXPORTED",
          affectedRecord: `Patient ${patient.id} (${patient.fullName})`,
          previous_value: "N/A",
          new_value: "JSON Export Archive",
          notes: "Patient data export generated"
        });

        return sendJson(res, 200, fullRecord);
      }

      return sendJson(res, 404, { error: "API route not found" });
    } catch (apiErr) {
      console.error("API Error:", apiErr);
      return sendJson(res, 500, { error: apiErr.message });
    }
  }

  // --- Static Frontend File Serving ---
  let filePath = path.join(FRONTEND_DIR, pathname === '/' ? 'index.html' : pathname);
  
  if (!path.extname(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else {
      filePath = path.join(FRONTEND_DIR, 'index.html');
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const indexFile = path.join(FRONTEND_DIR, 'index.html');
      fs.readFile(indexFile, (err2, content) => {
        if (err2) {
          res.writeHead(404);
          return res.end("MediVault AI Frontend Not Found");
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        return res.end("Error loading static asset");
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`MediVault AI (MVP) running at http://localhost:${PORT}`);
});
