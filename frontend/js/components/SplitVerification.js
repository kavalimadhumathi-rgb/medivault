/**
 * MediVault AI - Human Verification / Split-Screen Review (Prompt 2 MVP)
 * LEFT: Original Document Source Preview (Simulated Clinical Letterhead & Values)
 * RIGHT: Extracted Parameters with Verification States:
 *   - Pending Review
 *   - Verified
 *   - Edited
 *   - Rejected
 *   - Needs Clarification
 * Actions: Verify, Edit (with reason), Reject, and "Review Manually" fallback.
 */
window.SplitVerificationComponent = {
  render(state) {
    const activePatient = state.activePatient;
    const reports = (state.reports || []).filter(r => !activePatient || r.patientId === activePatient.id);
    const selectedReportId = state.selectedVerificationReportId || (reports[0] ? reports[0].id : null);
    const report = (state.reports || []).find(r => r.id === selectedReportId) || reports[0];

    if (!report) {
      return `
        <div class="p-12 text-center">
          <h2 class="text-base font-bold text-slate-800">No Document Selected for Verification</h2>
          <button onclick="window.app.navigateTo('patient-record')" class="mt-4 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl">
            Return to Record
          </button>
        </div>
      `;
    }

    const docMock = window.MOCK_DOCUMENTS[report.id] || {
      title: "CLINICAL LABORATORY REPORT",
      subTitle: "Accredited Medical Diagnostic Center",
      facilityInfo: report.facility || "Central Medical Laboratories",
      patientName: activePatient ? activePatient.fullName : "Patient",
      patientId: report.patientId,
      dob: activePatient ? activePatient.dob : "N/A",
      specimenId: "SPEC-2026-X99",
      collectedDate: report.reportDate,
      orderingPhysician: report.orderingPhysician || "Dr. Clara Zhang, MD",
      page: 1,
      totalPages: 1,
      rows: []
    };

    const extractedLabs = (state.labs || []).filter(l => l.reportId === report.id);

    return `
      <div class="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
        <!-- Top Controls Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">Human Verification & Split-Screen Review</h1>
              <span class="text-[11px] font-bold px-2 py-0.5 rounded-full badge-needs-verification">Safety Stage 5</span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              Compare AI-extracted parameters side-by-side with original clinical document before certifying into the permanent record.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2">
              <label class="text-xs font-semibold text-slate-600">Document:</label>
              <select 
                onchange="window.app.setVerificationReport(this.value)"
                class="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
              >
                ${reports.map(r => `
                  <option value="${r.id}" ${r.id === selectedReportId ? 'selected' : ''}>${r.fileName} (${r.reportType})</option>
                `).join('')}
              </select>
            </div>

            <button 
              onclick="window.app.openManualLabEntryModal()" 
              class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 flex items-center gap-1.5"
              title="Manually add or correct a lab parameter"
            >
              <i data-lucide="plus-circle" class="w-3.5 h-3.5 text-slate-500"></i> Manual Entry
            </button>
          </div>
        </div>

        <!-- Split Screen Container -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          <!-- LEFT: Source Document Preview -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="file-text" class="w-4 h-4 text-teal-600"></i> Original Source Document
              </span>
              <span class="text-[11px] text-slate-500 font-mono">Page ${docMock.page} of ${docMock.totalPages}</span>
            </div>

            <div class="doc-sheet p-6 bg-white min-h-[580px] text-xs relative rounded-xl border border-slate-300 shadow-inner">
              <!-- Letterhead -->
              <div class="text-center pb-4 border-b-2 border-slate-800">
                <div class="font-bold text-base tracking-wide text-slate-900 uppercase">${docMock.title}</div>
                <div class="text-[10px] text-slate-600 font-sans tracking-tight mt-0.5">${docMock.subTitle}</div>
                <div class="text-[9px] text-slate-500 font-sans mt-0.5">${docMock.facilityInfo}</div>
              </div>

              <!-- Patient Demographics Header in document -->
              <div class="grid grid-cols-2 gap-2 py-3 border-b border-slate-300 font-sans text-[11px]">
                <div><strong>Patient:</strong> ${docMock.patientName} (${docMock.patientId})</div>
                <div><strong>Specimen ID:</strong> ${docMock.specimenId}</div>
                <div><strong>DOB / Age:</strong> ${docMock.dob}</div>
                <div><strong>Collected:</strong> ${docMock.collectedDate}</div>
                <div><strong>Ordering:</strong> ${docMock.orderingPhysician}</div>
                <div><strong>Facility:</strong> ${report.facility}</div>
              </div>

              <!-- Document Table Rows with OCR Bounding Box Simulation -->
              <div class="mt-4 font-sans">
                <table class="w-full text-left text-[11px]">
                  <thead>
                    <tr class="border-b border-slate-300 text-slate-600 font-bold">
                      <th class="py-1">TEST NAME</th>
                      <th class="py-1 text-right">RESULT</th>
                      <th class="py-1 pl-2">UNITS</th>
                      <th class="py-1">REFERENCE INTERVAL</th>
                      <th class="py-1 text-center">FLAG</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200">
                    ${(docMock.rows || []).map(row => `
                      <tr class="ocr-highlight hover:bg-teal-50/70 transition">
                        <td class="py-2 font-medium">${row.testName}</td>
                        <td class="py-2 text-right font-bold font-mono">${row.result}</td>
                        <td class="py-2 pl-2 text-slate-600 font-mono text-[10px]">${row.unit}</td>
                        <td class="py-2 font-mono text-[10px]">${row.refRange}</td>
                        <td class="py-2 text-center">
                          ${row.flag && row.flag !== 'Normal' ? `
                            <span class="font-bold text-[10px] px-1 py-0.2 rounded ${row.flag === 'HIGH' ? 'text-rose-700 bg-rose-100' : 'text-amber-700 bg-amber-100'}">
                              ${row.flag}
                            </span>
                          ` : `
                            <span class="text-slate-400 text-[10px]">Normal</span>
                          `}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <!-- Footer Notes -->
              <div class="mt-6 pt-4 border-t border-slate-300 text-[10px] text-slate-500 font-sans">
                <div class="font-bold text-slate-700">DOCUMENT NOTES & INTERPRETATION:</div>
                <div class="mt-0.5">${docMock.footerNotes || 'Specimen processed in accordance with clinical CLIA standards. Strict verification required prior to clinical synthesis.'}</div>
                <div class="mt-3 flex items-center justify-between text-[9px] text-slate-400">
                  <span>Authorized Signature: Electronically Signed by Ordering Physician</span>
                  <span>CONFIDENTIAL MEDICAL RECORD</span>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: Extracted Structured Parameters -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="check-square" class="w-4 h-4 text-teal-600"></i> Extracted Parameters (${extractedLabs.length})
              </span>
              <button 
                onclick="window.app.verifyAllReportLabs('${report.id}')"
                class="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                <i data-lucide="check-check" class="w-3.5 h-3.5"></i> Verify All Confident Fields
              </button>
            </div>

            <div class="space-y-3">
              ${extractedLabs.map(lab => {
                const conf = lab.confidence ? Math.round(lab.confidence * 100) : 95;
                const isLowConf = conf < 70;
                const isCannotDetermine = lab.status === 'Cannot determine';
                const vStatus = lab.verificationStatus || 'Pending Review';

                return `
                  <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="font-extrabold text-sm text-slate-900">${lab.testName}</span>
                          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full badge-source-extracted">
                            ${lab.provenance || 'SOURCE EXTRACTED'}
                          </span>
                        </div>
                        <div class="text-[11px] text-slate-500 mt-0.5">Category: ${lab.category || 'Laboratory'} • Collected: ${lab.testDate}</div>
                      </div>

                      <span class="text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        vStatus === 'Verified' || vStatus === 'Verified by User' ? 'badge-verified' :
                        vStatus === 'Edited' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                        vStatus === 'Rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        vStatus === 'Needs Clarification' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'badge-needs-verification'
                      }">
                        ${vStatus}
                      </span>
                    </div>

                    <!-- Extracted Values Grid -->
                    <div class="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span class="text-[10px] text-slate-400 uppercase font-semibold">Value</span>
                        <div class="font-extrabold font-mono text-slate-900 text-sm">${lab.value} ${lab.unit}</div>
                      </div>
                      <div>
                        <span class="text-[10px] text-slate-400 uppercase font-semibold">Source Range</span>
                        <div class="font-mono text-slate-700 font-medium">
                          ${lab.referenceRange || 'Not provided'}
                        </div>
                      </div>
                      <div>
                        <span class="text-[10px] text-slate-400 uppercase font-semibold">Evaluated Status</span>
                        <div class="font-bold ${
                          isCannotDetermine ? 'text-slate-600' :
                          lab.status === 'High' ? 'text-rose-600' :
                          lab.status === 'Low' ? 'text-amber-600' : 'text-emerald-600'
                        }">
                          ${lab.status}
                        </div>
                      </div>
                    </div>

                    <!-- Confidence & OCR Metrics -->
                    <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                      <div class="flex items-center gap-1.5 ${isLowConf ? 'text-amber-700 font-bold' : 'text-slate-500'}">
                        <i data-lucide="${isLowConf ? 'alert-circle' : 'check-circle-2'}" class="w-3.5 h-3.5"></i>
                        <span>OCR Confidence: ${conf}%</span>
                        ${isLowConf ? '<span class="text-[10px] bg-amber-100 px-1.5 py-0.2 rounded text-amber-800">(Handwriting Scan)</span>' : ''}
                      </div>

                      <!-- Action Buttons: Verify, Edit, Reject -->
                      <div class="flex items-center gap-1.5">
                        <button 
                          onclick="window.app.verifyLabItem('${lab.id}', 'Verified')"
                          class="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                          title="Certify into medical record"
                        >
                          <i data-lucide="check" class="w-3 h-3"></i> Verify
                        </button>
                        <button 
                          onclick="window.app.openEditLabModal('${lab.id}')"
                          class="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                          title="Edit extracted value, unit, or range"
                        >
                          <i data-lucide="edit-2" class="w-3 h-3"></i> Edit
                        </button>
                        <button 
                          onclick="window.app.verifyLabItem('${lab.id}', 'Rejected')"
                          class="px-2 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold transition"
                          title="Reject invalid extraction"
                        >
                          <i data-lucide="x" class="w-3 h-3"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

        </div>
      </div>
    `;
  }
};
