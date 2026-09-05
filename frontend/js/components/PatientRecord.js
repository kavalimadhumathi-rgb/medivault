/**
 * MediVault AI - Structured Medical Record Component (Prompt 2 MVP)
 * 4 Header Action Buttons:
 *  - Upload Report
 *  - Edit Patient
 *  - Generate Summary
 *  - Compare Reports
 * 
 * 6 Navigation Tabs:
 *  - Overview
 *  - Laboratory Results
 *  - Medical Reports
 *  - Timeline
 *  - AI Summary
 *  - Conflicts & Inconsistencies
 */
window.PatientRecordComponent = {
  render(state, activeTab = 'overview') {
    const patient = state.activePatient;
    if (!patient) {
      return `
        <div class="p-12 text-center">
          <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <i data-lucide="user-x" class="w-6 h-6"></i>
          </div>
          <h2 class="text-base font-bold text-slate-800">No Patient Selected</h2>
          <p class="text-xs text-slate-500 mt-1">Please select a patient from the dashboard or registry to view their medical record.</p>
          <button onclick="window.app.navigateTo('dashboard')" class="mt-4 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-teal-700 transition">
            Return to Dashboard
          </button>
        </div>
      `;
    }

    const patientLabs = (state.labs || []).filter(l => l.patientId === patient.id);
    const patientReports = (state.reports || []).filter(r => r.patientId === patient.id);
    const patientTimeline = (state.timeline || []).filter(t => t.patientId === patient.id);
    const patientConflicts = (state.inconsistencies || []).filter(c => c.patientId === patient.id);
    const userProv = patient.userProvided || {};

    const statusClass = 
      patient.verificationStatus === 'Conflicts Detected' ? 'badge-conflict' :
      patient.verificationStatus === 'Needs Review' ? 'badge-needs-verification' : 'badge-verified';

    return `
      <div class="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
        <!-- Patient Record Header Bar with 4 Required Action Buttons -->
        <div class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-sm">
              ${patient.fullName.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2.5">
                <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">${patient.fullName}</h1>
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${statusClass}">
                  ${patient.verificationStatus}
                </span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                  MRN: ${patient.id}
                </span>
              </div>
              <div class="mt-1.5 flex flex-wrap items-center gap-2.5 text-xs text-slate-500 font-medium">
                <span>DOB: <strong class="text-slate-700">${patient.dob}</strong> (${patient.age} yrs)</span>
                <span>•</span>
                <span>Sex: <strong class="text-slate-700">${patient.sex}</strong></span>
                <span>•</span>
                <span>Phone: ${patient.phone || 'None'}</span>
                <span>•</span>
                <span>Emergency: ${patient.emergencyContact ? `${patient.emergencyContact.name} (${patient.emergencyContact.relation}, ${patient.emergencyContact.phone})` : 'Not recorded'}</span>
              </div>
            </div>
          </div>

          <!-- 4 Required Header Action Buttons -->
          <div class="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <!-- 1. Upload Report -->
            <button 
              onclick="window.app.navigateTo('upload')" 
              class="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
              title="Upload new clinical report for AI parsing"
            >
              <i data-lucide="upload-cloud" class="w-3.5 h-3.5"></i> Upload Report
            </button>

            <!-- 2. Edit Patient -->
            <button 
              onclick="window.app.openEditPatientModal('${patient.id}')" 
              class="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
              title="Edit patient profile, symptoms, conditions & medications"
            >
              <i data-lucide="user-cog" class="w-3.5 h-3.5 text-slate-600"></i> Edit Patient
            </button>

            <!-- 3. Generate Summary -->
            <button 
              onclick="window.app.setRecordTab('ai-summary')" 
              class="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
              title="Synthesize AI non-diagnostic clinical summary"
            >
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-purple-600"></i> Generate Summary
            </button>

            <!-- 4. Compare Reports -->
            <button 
              onclick="window.app.navigateTo('compare')" 
              class="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
              title="Side-by-side longitudinal report comparison"
            >
              <i data-lucide="git-compare" class="w-3.5 h-3.5 text-blue-600"></i> Compare Reports
            </button>
          </div>
        </div>

        <!-- 6 Navigation Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-2">
          <button 
            onclick="window.app.setRecordTab('overview')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }"
          >
            <i data-lucide="layout" class="w-3.5 h-3.5"></i> Overview
          </button>
          <button 
            onclick="window.app.setRecordTab('labs')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'labs' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }"
          >
            <i data-lucide="test-tubes" class="w-3.5 h-3.5"></i> Lab Results (${patientLabs.length})
          </button>
          <button 
            onclick="window.app.setRecordTab('reports')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'reports' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }"
          >
            <i data-lucide="file-text" class="w-3.5 h-3.5"></i> Medical Reports (${patientReports.length})
          </button>
          <button 
            onclick="window.app.setRecordTab('timeline')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'timeline' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }"
          >
            <i data-lucide="calendar" class="w-3.5 h-3.5"></i> Timeline (${patientTimeline.length})
          </button>
          <button 
            onclick="window.app.setRecordTab('ai-summary')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'ai-summary' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }"
          >
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> AI Summary
          </button>
          <button 
            onclick="window.app.setRecordTab('conflicts')"
            class="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'conflicts' ? 'bg-rose-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }"
          >
            <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i> Conflicts (${patientConflicts.length})
          </button>
        </div>

        <!-- Tab Content Areas -->
        <div class="space-y-6">
          ${
            activeTab === 'overview' ? this.renderOverviewTab(patient, patientLabs, patientReports, patientConflicts) :
            activeTab === 'labs' ? window.LabResultsTableComponent.render(state) :
            activeTab === 'reports' ? this.renderReportsTab(patient, patientReports) :
            activeTab === 'timeline' ? this.renderTimelineTab(patient, patientTimeline) :
            activeTab === 'ai-summary' ? window.AISummaryViewComponent.render(state) :
            activeTab === 'conflicts' ? window.InconsistenciesComponent.render(state) :
            this.renderOverviewTab(patient, patientLabs, patientReports, patientConflicts)
          }
        </div>
      </div>
    `;
  },

  renderOverviewTab(patient, labs, reports, conflicts) {
    const userProv = patient.userProvided || {};
    const symptoms = Array.isArray(userProv.symptoms) ? userProv.symptoms : (userProv.symptoms ? [{ text: userProv.symptoms, source: 'USER PROVIDED' }] : []);
    const conditions = Array.isArray(userProv.conditions) ? userProv.conditions : (userProv.conditions ? [{ text: userProv.conditions, source: 'USER PROVIDED' }] : []);
    const allergies = Array.isArray(userProv.allergies) ? userProv.allergies : (userProv.allergies ? [{ allergen: userProv.allergies, source: 'USER PROVIDED' }] : []);
    const medications = Array.isArray(userProv.medications) ? userProv.medications : (userProv.medications ? [{ name: userProv.medications, source: 'USER PROVIDED' }] : []);

    const outOfRangeLabs = labs.filter(l => l.status === 'High' || l.status === 'Low');
    const cannotDetermineLabs = labs.filter(l => l.status === 'Cannot determine');

    return `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <!-- Left 2 Cols: Clinical Profile -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Clinical Watchlist Banner if abnormal labs exist -->
          ${outOfRangeLabs.length > 0 ? `
            <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
              <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i data-lucide="alert-circle" class="w-5 h-5"></i>
              </div>
              <div class="text-xs">
                <div class="font-bold text-amber-900 text-sm">Notable Out-of-Range Clinical Findings (${outOfRangeLabs.length})</div>
                <p class="text-amber-800 mt-0.5">
                  The following extracted values fall outside source-provided laboratory reference intervals:
                </p>
                <div class="flex flex-wrap gap-2 mt-2">
                  ${outOfRangeLabs.map(l => `
                    <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-[11px] font-bold text-amber-900 shadow-2xs">
                      ${l.testName}: <span class="${l.status === 'High' ? 'text-rose-600' : 'text-amber-600'} font-extrabold">${l.value} ${l.unit}</span> 
                      (${l.status}, ref: ${l.referenceRange})
                    </span>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Strict Range Rule Notice if "Cannot determine" labs exist -->
          ${cannotDetermineLabs.length > 0 ? `
            <div class="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
              <div class="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i data-lucide="shield-alert" class="w-5 h-5"></i>
              </div>
              <div class="text-xs">
                <div class="font-bold text-slate-800 text-sm">Safety Notice: Reference Intervals Not Provided</div>
                <p class="text-slate-600 mt-0.5">
                  ${cannotDetermineLabs.map(l => `<strong>${l.testName}</strong>`).join(', ')} did not include a reference interval in the source diagnostic report. MediVault AI strictly records the status as <em>"Cannot determine"</em> and never fabricates normal/high thresholds.
                </p>
              </div>
            </div>
          ` : ''}

          <!-- Patient Profile Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <!-- Symptoms Card -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <i data-lucide="activity" class="w-4 h-4 text-teal-600"></i> Reported Symptoms
                </span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full badge-user-provided">USER PROVIDED</span>
              </div>
              <ul class="space-y-2 text-xs">
                ${symptoms.length > 0 ? symptoms.map(s => `
                  <li class="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between">
                    <span class="font-medium text-slate-800">${typeof s === 'string' ? s : s.text}</span>
                    <span class="text-[10px] text-slate-400 font-mono">${s.dateAdded || ''}</span>
                  </li>
                `).join('') : '<li class="text-slate-400 italic">No symptoms recorded</li>'}
              </ul>
            </div>

            <!-- Conditions Card -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <i data-lucide="heart-pulse" class="w-4 h-4 text-rose-500"></i> Active Conditions
                </span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full badge-user-provided">USER PROVIDED</span>
              </div>
              <ul class="space-y-2 text-xs">
                ${conditions.length > 0 ? conditions.map(c => `
                  <li class="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between">
                    <span class="font-bold text-slate-800">${typeof c === 'string' ? c : c.text}</span>
                    <span class="text-[10px] text-slate-500 font-mono">${c.diagnosedYear ? `Dx: ${c.diagnosedYear}` : ''}</span>
                  </li>
                `).join('') : '<li class="text-slate-400 italic">No conditions recorded</li>'}
              </ul>
            </div>

            <!-- Allergies Card -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <i data-lucide="alert-octagon" class="w-4 h-4 text-rose-600"></i> Documented Allergies
                </span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full badge-user-provided">USER PROVIDED</span>
              </div>
              <ul class="space-y-2 text-xs">
                ${allergies.length > 0 ? allergies.map(a => `
                  <li class="p-2.5 bg-rose-50/70 rounded-xl border border-rose-200 text-rose-900">
                    <div class="font-bold text-xs">${typeof a === 'string' ? a : a.allergen}</div>
                    ${a.reaction ? `<div class="text-[11px] text-rose-700 mt-0.5">Reaction: ${a.reaction} (${a.severity || 'Moderate'})</div>` : ''}
                  </li>
                `).join('') : '<li class="text-slate-400 italic">No known drug allergies</li>'}
              </ul>
            </div>

            <!-- Current Medications Card -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <i data-lucide="pill" class="w-4 h-4 text-blue-600"></i> Reported Medications
                </span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full badge-user-provided">USER PROVIDED</span>
              </div>
              <ul class="space-y-2 text-xs">
                ${medications.length > 0 ? medications.map(m => `
                  <li class="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div class="font-bold text-slate-800">${typeof m === 'string' ? m : m.name}</div>
                    ${m.dosage ? `<div class="text-[11px] text-slate-500 mt-0.5">${m.dosage} • ${m.frequency || 'Daily'}</div>` : ''}
                  </li>
                `).join('') : '<li class="text-slate-400 italic">No medications recorded</li>'}
              </ul>
            </div>

          </div>

          <!-- Medical History & Family Background -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <i data-lucide="book-open" class="w-4 h-4 text-teal-600"></i> Clinical History & Background
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div class="font-bold text-slate-700 mb-1">Past Medical History</div>
                <p class="text-slate-600 leading-relaxed">${userProv.medicalHistory || 'None documented.'}</p>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div class="font-bold text-slate-700 mb-1">Family Medical History</div>
                <p class="text-slate-600 leading-relaxed">${userProv.familyHistory || 'None documented.'}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right 1 Col: Quick Actions & Summary -->
        <div class="space-y-6">
          <!-- Summary Quick Card -->
          <div class="bg-gradient-to-br from-teal-800 to-slate-900 text-white p-6 rounded-2xl shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="sparkles" class="w-4 h-4"></i> AI Record Synthesis
              </span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-teal-200">Non-Diagnostic</span>
            </div>
            <p class="text-xs text-slate-200 leading-relaxed">
              MediVault AI has organized ${reports.length} clinical documents containing ${labs.length} verified parameters for ${patient.fullName}.
            </p>
            <div class="pt-2 border-t border-white/10 flex items-center justify-between">
              <button 
                onclick="window.app.setRecordTab('ai-summary')" 
                class="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-sm"
              >
                Read Structured Summary →
              </button>
            </div>
          </div>

          <!-- Discrepancy Alert Box if conflicts exist -->
          ${conflicts.length > 0 ? `
            <div class="bg-rose-50 border border-rose-200 p-5 rounded-2xl shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-600"></i> Clinical Inconsistencies
                </span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full badge-conflict">
                  ${conflicts.filter(c => c.status !== 'Resolved' && c.status !== 'Dismissed').length} Unresolved
                </span>
              </div>
              <p class="text-xs text-rose-800 leading-relaxed">
                Discrepancies detected between patient self-reports and uploaded discharge/lab records.
              </p>
              <button 
                onclick="window.app.setRecordTab('conflicts')" 
                class="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                Review Inconsistencies →
              </button>
            </div>
          ` : ''}

          <!-- Recent Uploaded Reports Quick List -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <i data-lucide="files" class="w-4 h-4 text-teal-600"></i> Reports On File
              </span>
              <button onclick="window.app.setRecordTab('reports')" class="text-xs text-teal-600 hover:underline font-bold">
                View All (${reports.length})
              </button>
            </div>
            <div class="space-y-2 text-xs">
              ${reports.map(r => `
                <div class="p-2.5 bg-slate-50 hover:bg-teal-50/50 rounded-xl border border-slate-100 flex items-center justify-between transition cursor-pointer" onclick="window.app.openDocumentVerification('${r.id}')">
                  <div class="truncate max-w-[170px]">
                    <div class="font-bold text-slate-800 truncate">${r.fileName}</div>
                    <div class="text-[10px] text-slate-500">${r.reportType} • ${r.reportDate}</div>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full badge-verified">
                    ${r.status}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    `;
  },

  renderReportsTab(patient, reports) {
    return `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900">Uploaded Medical Documents</h3>
            <p class="text-xs text-slate-500 mt-0.5">All diagnostic panels, discharge summaries, and prescription scans for ${patient.fullName}.</p>
          </div>
          <button onclick="window.app.navigateTo('upload')" class="px-3.5 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition flex items-center gap-1.5">
            <i data-lucide="upload" class="w-3.5 h-3.5"></i> Upload Document
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          ${reports.map(r => `
            <div class="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-teal-50/30 transition space-y-3 flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-2">
                  <span class="text-xs font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">${r.id}</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full badge-verified">${r.status}</span>
                </div>
                <div class="font-bold text-slate-900 text-sm mt-2 line-clamp-1">${r.fileName}</div>
                <div class="text-xs text-slate-500 mt-1">${r.reportType}</div>
                <div class="text-[11px] text-slate-400 mt-0.5">Facility: ${r.facility || 'Clinical Lab'}</div>
                <div class="text-[11px] text-slate-400">Date: ${r.reportDate}</div>
              </div>

              <div class="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <button 
                  onclick="window.app.openDocumentVerification('${r.id}')"
                  class="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                >
                  <i data-lucide="split-square-vertical" class="w-3.5 h-3.5"></i> Split Verification →
                </button>
                <span class="text-[11px] text-slate-400 font-mono">${r.fileSize}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderTimelineTab(patient, timeline) {
    return `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <h3 class="text-base font-bold text-slate-900">Chronological Medical Timeline</h3>
          <p class="text-xs text-slate-500 mt-0.5">Consolidated chronological view of encounters, diagnostic panels, and prescriptions.</p>
        </div>

        <div class="relative pl-6 border-l-2 border-teal-500/30 space-y-6">
          ${timeline.map(item => `
            <div class="relative group">
              <div class="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-teal-600 ring-4 ring-white border-2 border-teal-200"></div>
              <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-900 text-sm">${item.title}</span>
                  <span class="text-slate-500 font-mono text-[11px]">${item.date}</span>
                </div>
                <p class="text-slate-600">${item.description}</p>
                <div class="pt-2 flex items-center gap-2 text-[10px] text-slate-500">
                  <span class="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">${item.category}</span>
                  <span>Source: ${item.sourceDoc || 'Clinical Record'}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};
