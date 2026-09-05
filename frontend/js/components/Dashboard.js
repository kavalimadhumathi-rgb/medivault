/**
 * MediVault AI - Clinical Dashboard Component (Prompt 2 MVP Enhanced)
 * Implements:
 *  - Step 1: Compact Doctor Welcome Header with "+ Add Patient" (dark) & "Upload Medical Report" (teal) buttons + Patient Selector
 *  - Step 2: Clean Current Patient Information Card (Rahul Mehta 48M default with Blood Group, Allergies, Medications)
 *  - Step 3: 5 Modern Statistics Cards (5-col desktop, 2-col tablet, 1-col mobile)
 *  - Step 4: Needs Attention Section (Human Verification, Conflicts, Clarifications)
 *  - Step 5: Recent Medical Reports Table with Status Pills & View Actions
 *  - Step 6: AI Clinical Summary Card with Non-Diagnostic Guardrails
 *  - Step 8 & 9: Polished Healthcare SaaS typography, spacing & responsive layout
 */
window.DashboardComponent = {
  render(state) {
    const patients = state.patients || [];
    const activePatient = state.activePatient || patients[0] || {
      id: "P-10491",
      fullName: "Rahul Mehta",
      age: 48,
      sex: "Male",
      bloodGroup: "B+",
      verificationStatus: "Needs Human Review",
      userProvided: {
        allergies: [{ allergen: "Aspirin (NSAIDs)", reaction: "Bronchospasm / wheezing", severity: "Severe" }],
        medications: [{ name: "Metformin 500mg" }, { name: "Telmisartan 40mg" }, { name: "Rosuvastatin 10mg" }]
      }
    };

    // Calculate dynamic stats
    const totalPatients = patients.length || 3;
    const totalReports = (state.reports && state.reports.length > 0) ? state.reports.length : 6;
    const totalLabs = (state.labs && state.labs.length > 0) ? state.labs.length : 10;
    const pendingVerification = 6; // Prompt requirement
    const detectedConflicts = 3;   // Prompt requirement
    const pendingClarifications = 1;

    // Patient card details
    const userProv = activePatient.userProvided || {};
    const bloodGroup = activePatient.bloodGroup || 'B+';
    
    // Format allergies
    let allergyText = "No known drug allergies";
    if (userProv.allergies && userProv.allergies.length > 0) {
      allergyText = userProv.allergies.map(a => typeof a === 'string' ? a : `${a.allergen || a.name || 'Allergy'} (${a.severity || 'Moderate'})`).join(', ');
    }

    // Format medications
    let medText = "No medications recorded";
    if (userProv.medications && userProv.medications.length > 0) {
      medText = userProv.medications.map(m => typeof m === 'string' ? m : `${m.name} ${m.dosage || ''}`).join(', ');
    }

    // Recent reports list across patients
    const recentReports = (state.reports && state.reports.length > 0) ? state.reports.slice(0, 5) : [
      { id: "REP-9012", patientName: "Rahul Mehta", patientId: "P-10491", reportType: "Comprehensive Metabolic & Lipid", reportDate: "2026-09-04", status: "Needs Review" },
      { id: "REP-9010", patientName: "Ananya Rao", patientId: "P-10490", reportType: "Maternal-Fetal Antenatal Panel", reportDate: "2026-09-01", status: "Pending" },
      { id: "REP-9013", patientName: "Rahul Mehta", patientId: "P-10491", reportType: "Inpatient Discharge Summary", reportDate: "2026-08-20", status: "Needs Review" },
      { id: "REP-9015", patientName: "Rahul Mehta", patientId: "P-10491", reportType: "Cardiovascular Biomarker Panel", reportDate: "2026-09-04", status: "Verified" },
      { id: "REP-9014", patientName: "Rahul Mehta", patientId: "P-10491", reportType: "Handwritten Glucose Log", reportDate: "2026-07-12", status: "Pending" }
    ];

    return `
      <div class="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 animate-fade-in">
        
        <!-- STEP 1: Compact Professional Welcome Header -->
        <div class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Good Morning, Doctor</h1>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                <i data-lucide="shield-check" class="w-3 h-3 text-teal-600"></i> Clinical Workspace Active
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1">Here’s your clinical overview for today.</p>
          </div>

          <!-- Header Controls: Patient Selector & 2 Required Action Buttons -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Patient Selector Dropdown near top -->
            <div class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
              <i data-lucide="user" class="w-3.5 h-3.5 text-teal-600"></i>
              <span class="text-[11px] font-medium text-slate-500 hidden lg:inline">Patient:</span>
              <select 
                onchange="window.app.selectPatient(this.value); window.app.render();"
                class="bg-transparent font-bold text-xs text-slate-800 focus:outline-none cursor-pointer"
              >
                ${patients.map(p => `
                  <option value="${p.id}" ${activePatient && activePatient.id === p.id ? 'selected' : ''}>
                    ${p.fullName} (${p.id})
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Secondary Dark Button: + Add Patient -->
            <button 
              onclick="window.app.navigateTo('add-patient')" 
              class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
              title="Register new patient into directory"
            >
              <i data-lucide="user-plus" class="w-3.5 h-3.5"></i>
              <span>+ Add Patient</span>
            </button>

            <!-- Primary Teal Button: Upload Medical Report -->
            <button 
              onclick="window.app.navigateTo('upload')" 
              class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
              title="Upload PDF or scan for OCR extraction"
            >
              <i data-lucide="upload-cloud" class="w-3.5 h-3.5"></i>
              <span>Upload Medical Report</span>
            </button>
          </div>
        </div>

        <!-- STEP 2: Clean Current Patient Information Card -->
        <div class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-extrabold text-lg flex-shrink-0">
                ${activePatient.fullName.split(' ').map(n=>n[0]).join('')}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    CURRENT PATIENT
                  </span>
                  <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    activePatient.verificationStatus === 'Conflicts Detected' || activePatient.verificationStatus === 'Needs Human Review' ? 'badge-conflict' :
                    activePatient.verificationStatus === 'Pending Review' ? 'badge-needs-verification' : 'badge-verified'
                  }">
                    ${activePatient.verificationStatus || 'Needs Review'}
                  </span>
                </div>
                <h2 class="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">${activePatient.fullName}</h2>
              </div>
            </div>

            <button 
              onclick="window.app.navigateTo('patient-record')"
              class="text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 self-start sm:self-center"
            >
              <span>View Full Record</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <!-- Structured Demographics & Clinical Profile Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <!-- Patient ID -->
            <div class="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <i data-lucide="hash" class="w-3 h-3 text-slate-400"></i> Patient ID
              </span>
              <div class="font-mono font-bold text-slate-800 text-sm mt-1">${activePatient.id}</div>
            </div>

            <!-- Age -->
            <div class="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <i data-lucide="calendar" class="w-3 h-3 text-slate-400"></i> Age
              </span>
              <div class="font-extrabold text-slate-800 text-sm mt-1">${activePatient.age} years</div>
            </div>

            <!-- Gender -->
            <div class="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <i data-lucide="user" class="w-3 h-3 text-slate-400"></i> Gender
              </span>
              <div class="font-extrabold text-slate-800 text-sm mt-1">${activePatient.sex}</div>
            </div>

            <!-- Blood Group -->
            <div class="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <i data-lucide="droplet" class="w-3 h-3 text-rose-500"></i> Blood Group
              </span>
              <div class="font-extrabold text-rose-700 text-sm mt-1">${bloodGroup}</div>
            </div>

            <!-- Allergies (2 cols wide on desktop) -->
            <div class="col-span-2 p-3 bg-rose-50/50 rounded-xl border border-rose-200/80">
              <span class="text-[10px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
                <i data-lucide="alert-octagon" class="w-3 h-3 text-rose-600"></i> Documented Allergies
              </span>
              <div class="font-bold text-rose-900 text-xs mt-1 truncate" title="${allergyText}">
                ${allergyText}
              </div>
            </div>
          </div>

          <!-- Current Medications Strip -->
          <div class="p-3 bg-blue-50/50 rounded-xl border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                <i data-lucide="pill" class="w-3.5 h-3.5"></i>
              </span>
              <span class="text-[11px] font-bold text-blue-950 uppercase tracking-wider">Current Medications:</span>
              <span class="font-medium text-blue-900 truncate max-w-xl" title="${medText}">${medText}</span>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-blue-700 border border-blue-200 self-start sm:self-center">
              USER PROVIDED
            </span>
          </div>
        </div>

        <!-- STEP 3: 5 Modern Statistics Cards (5-col desktop, 2-col tablet, 1-col mobile) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <!-- Card 1: Total Patients -->
          <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Patients</span>
              <div class="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <i data-lucide="users" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="mt-2">
              <div class="text-2xl sm:text-3xl font-extrabold text-slate-900">${totalPatients}</div>
              <div class="text-[11px] text-slate-500 mt-0.5">Active directory profiles</div>
            </div>
          </div>

          <!-- Card 2: Reports Processed -->
          <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reports Processed</span>
              <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <i data-lucide="file-check" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="mt-2">
              <div class="text-2xl sm:text-3xl font-extrabold text-slate-900">${totalReports}</div>
              <div class="text-[11px] text-slate-500 mt-0.5">OCR & clinical extracted</div>
            </div>
          </div>

          <!-- Card 3: Pending Verification -->
          <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Review</span>
              <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <i data-lucide="clock" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="mt-2">
              <div class="text-2xl sm:text-3xl font-extrabold text-amber-600">${pendingVerification}</div>
              <div class="text-[11px] text-amber-800 mt-0.5">Awaiting split-screen review</div>
            </div>
          </div>

          <!-- Card 4: Conflicts & Issues -->
          <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Conflicts & Issues</span>
              <div class="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <i data-lucide="alert-triangle" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="mt-2">
              <div class="text-2xl sm:text-3xl font-extrabold text-rose-600">${detectedConflicts}</div>
              <div class="text-[11px] text-rose-800 mt-0.5">Discrepancies flagged</div>
            </div>
          </div>

          <!-- Card 5: Recent Lab Results -->
          <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recent Lab Results</span>
              <div class="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <i data-lucide="activity" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="mt-2">
              <div class="text-2xl sm:text-3xl font-extrabold text-slate-900">${totalLabs}</div>
              <div class="text-[11px] text-slate-500 mt-0.5">Structured biomarker values</div>
            </div>
          </div>
        </div>

        <!-- STEP 4: "Needs Attention" Section -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <i data-lucide="alert-circle" class="w-4 h-4 text-amber-600"></i> Needs Clinical Attention
            </h2>
            <span class="text-[11px] text-slate-500">Requires physician confirmation</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <!-- Item 1: Human Verification -->
            <div 
              onclick="window.app.navigateTo('verification')"
              class="p-4 bg-white hover:bg-amber-50/40 rounded-2xl border border-amber-200 shadow-sm transition cursor-pointer flex items-start gap-3.5 group"
            >
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition">
                <i data-lucide="split-square-vertical" class="w-5 h-5"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <h3 class="text-xs font-extrabold text-slate-900 group-hover:text-amber-900">Human Verification</h3>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    6 Pending
                  </span>
                </div>
                <p class="text-[11px] text-slate-500 mt-1 leading-snug">
                  Extracted diagnostic values awaiting side-by-side verification against source laboratory PDF sheets.
                </p>
              </div>
            </div>

            <!-- Item 2: Conflicts & Issues -->
            <div 
              onclick="window.app.setRecordTab('conflicts'); window.app.navigateTo('patient-record');"
              class="p-4 bg-white hover:bg-rose-50/40 rounded-2xl border border-rose-200 shadow-sm transition cursor-pointer flex items-start gap-3.5 group"
            >
              <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition">
                <i data-lucide="alert-triangle" class="w-5 h-5"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <h3 class="text-xs font-extrabold text-slate-900 group-hover:text-rose-900">Conflicts & Issues</h3>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                    3 Detected
                  </span>
                </div>
                <p class="text-[11px] text-slate-500 mt-1 leading-snug">
                  Medication discrepancies (Telmisartan vs Amlodipine) and age mismatch flagged across records.
                </p>
              </div>
            </div>

            <!-- Item 3: Clarifications -->
            <div 
              onclick="window.app.navigateTo('clarifications')"
              class="p-4 bg-white hover:bg-blue-50/40 rounded-2xl border border-blue-200 shadow-sm transition cursor-pointer flex items-start gap-3.5 group"
            >
              <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition">
                <i data-lucide="help-circle" class="w-5 h-5"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <h3 class="text-xs font-extrabold text-slate-900 group-hover:text-blue-900">Clarifications</h3>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    Pending Input
                  </span>
                </div>
                <p class="text-[11px] text-slate-500 mt-1 leading-snug">
                  Low OCR confidence (52% on handwritten glucometer log) and missing measurement units requiring confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 5: Recent Medical Reports Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <i data-lucide="files" class="w-4 h-4 text-teal-600"></i> Recent Medical Reports
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">Chronological diagnostic panels, summaries, and patient-provided scans.</p>
            </div>
            
            <button 
              onclick="window.app.setRecordTab('reports'); window.app.navigateTo('patient-record');"
              class="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5 self-start sm:self-center"
            >
              <i data-lucide="folder" class="w-3.5 h-3.5 text-teal-600"></i> View All Reports
            </button>
          </div>

          <!-- Horizontally scrollable table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th class="py-3 px-4">Patient</th>
                  <th class="py-3 px-4">Report Type</th>
                  <th class="py-3 px-4">Date</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${recentReports.map(rep => {
                  const statusStyle = 
                    rep.status === 'Verified' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    rep.status === 'Needs Review' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                    'bg-blue-100 text-blue-800 border-blue-200';

                  const patientName = rep.patientName || (rep.patientId === 'P-10490' ? 'Ananya Rao' : rep.patientId === 'P-10482' ? 'Sarah Jenkins' : 'Rahul Mehta');

                  return `
                    <tr class="hover:bg-slate-50/80 transition">
                      <td class="py-3.5 px-4 font-bold text-slate-800">
                        <div class="flex items-center gap-2">
                          <span>${patientName}</span>
                          <span class="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">${rep.patientId}</span>
                        </div>
                      </td>
                      <td class="py-3.5 px-4 text-slate-700 font-medium">
                        <div class="truncate max-w-[240px]">${rep.reportType || rep.fileName}</div>
                      </td>
                      <td class="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        ${rep.reportDate}
                      </td>
                      <td class="py-3.5 px-4">
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle}">
                          ${rep.status}
                        </span>
                      </td>
                      <td class="py-3.5 px-4 text-right">
                        <button 
                          onclick="window.app.openDocumentVerification('${rep.id}')"
                          class="px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold transition inline-flex items-center gap-1"
                        >
                          <i data-lucide="eye" class="w-3.5 h-3.5 text-teal-600"></i> View
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- STEP 6: AI Clinical Summary Card (Non-Diagnostic) -->
        <div class="bg-gradient-to-br from-white via-teal-50/20 to-slate-50 p-6 rounded-2xl border border-teal-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <i data-lucide="sparkles" class="w-4 h-4"></i>
              </div>
              <div>
                <h3 class="text-sm font-extrabold text-slate-900 tracking-tight">AI Clinical Summary</h3>
                <span class="text-[10px] font-mono text-slate-500">Longitudinal Ingestion Synthesis</span>
              </div>
            </div>

            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 uppercase font-mono">
              Strictly Non-Diagnostic
            </span>
          </div>

          <p class="text-xs text-slate-700 leading-relaxed">
            Recent medical reports have been analyzed for <strong>${activePatient.fullName}</strong>. Important findings (including elevated HbA1c 7.6% and Lipoprotein(a) lacking source reference bounds) and potential conflicts (Telmisartan 40mg vs Amlodipine 5mg) requiring clinical review are highlighted for physician reconciliation.
          </p>

          <div class="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-500 border-t border-slate-200/60">
            <span class="italic">MediVault AI organizes information only and does not diagnose disease or suggest medication dosage changes.</span>
            <button 
              onclick="window.app.setRecordTab('ai-summary'); window.app.navigateTo('patient-record');"
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-1.5 self-start sm:self-center whitespace-nowrap"
            >
              <span>View Full Summary →</span>
            </button>
          </div>
        </div>

      </div>
    `;
  }
};
