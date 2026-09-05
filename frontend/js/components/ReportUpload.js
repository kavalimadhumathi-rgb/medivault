/**
 * MediVault AI - Report Upload & Processing Pipeline (Prompt 2 MVP)
 * 5-Step Pipeline: File uploaded -> OCR processing -> Entity extraction -> Reference range matching -> Verification ready
 * Prominent label: "Demo Processing — Not Real AI Extraction"
 * Unreadable document handling: Error state banner + "Review Manually" button
 */
window.ReportUploadComponent = {
  render(state) {
    const activePatient = state.activePatient;
    const isProcessing = state.uploadProgress && state.uploadProgress.isProcessing;
    const currentStep = state.uploadProgress ? state.uploadProgress.step : 1;
    const stepMessage = state.uploadProgress ? state.uploadProgress.message : '';
    const hasError = state.uploadProgress && state.uploadProgress.error;

    return `
      <div class="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Upload Medical Document</h1>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                Demo Processing — Not Real AI Extraction
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1">
              Supports diagnostic lab reports, urine panels, hospital discharge summaries, and prescription scans (PDF, JPG, PNG).
            </p>
          </div>
          <button onclick="window.app.navigateTo('patient-record')" class="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white">
            Back to Record
          </button>
        </div>

        <!-- 5-Step Pipeline Tracker -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Processing Pipeline</span>
            <span class="text-[11px] font-mono font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              ${hasError ? 'Pipeline Paused: Manual Action Required' : `Stage ${currentStep} of 5`}
            </span>
          </div>

          <!-- 5 Steps -->
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
            ${[
              { step: 1, label: 'File Uploaded', icon: 'upload' },
              { step: 2, label: 'OCR Processing', icon: 'scan' },
              { step: 3, label: 'Entity Extraction', icon: 'sparkles' },
              { step: 4, label: 'Range Matching', icon: 'shield-check' },
              { step: 5, label: 'Verification Ready', icon: 'check-circle' }
            ].map(s => {
              const isPast = s.step < currentStep;
              const isCurrent = s.step === currentStep;
              return `
                <div class="p-2.5 rounded-xl border transition ${
                  hasError && isCurrent
                    ? 'bg-rose-50 border-rose-400 text-rose-800'
                    : isCurrent 
                      ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 text-teal-800' 
                      : isPast 
                        ? 'bg-slate-50 border-slate-200 text-slate-700' 
                        : 'bg-white border-slate-100 text-slate-300'
                }">
                  <div class="w-7 h-7 rounded-lg mx-auto flex items-center justify-center mb-1 ${
                    hasError && isCurrent ? 'bg-rose-600 text-white' :
                    isCurrent ? 'bg-teal-600 text-white' : isPast ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-300'
                  }">
                    <i data-lucide="${s.icon}" class="w-3.5 h-3.5"></i>
                  </div>
                  <div class="text-[11px] font-bold truncate">${s.label}</div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Processing indicator -->
          ${isProcessing && !hasError ? `
            <div class="mt-4 p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-800 flex items-center gap-3">
              <div class="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <span>${stepMessage || 'Processing document pipeline...'}</span>
            </div>
          ` : ''}

          <!-- Unreadable Document / Error State Banner with "Review Manually" button -->
          ${hasError ? `
            <div class="mt-4 p-4 bg-rose-50 border border-rose-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i data-lucide="alert-triangle" class="w-5 h-5"></i>
                </div>
                <div>
                  <div class="font-bold text-rose-900 text-sm">Unable to confidently read this report</div>
                  <div class="text-xs text-rose-700 mt-0.5">
                    ${state.uploadProgress.errorMessage || 'Scan resolution degraded or handwriting confidence below clinical threshold (48%). To maintain medical record integrity, automated extraction has been halted.'}
                  </div>
                </div>
              </div>
              <button 
                onclick="window.app.openManualLabEntryModal()"
                class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 whitespace-nowrap self-start sm:self-center"
              >
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Review Manually
              </button>
            </div>
          ` : ''}
        </div>

        <!-- Preset Test Files / Quick Simulator -->
        <div class="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-200/80 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
              <i data-lucide="flask-conical" class="w-4 h-4 text-teal-700"></i> Fast Clinical Test Presets (Instant Pipeline Testing)
            </h3>
            <span class="text-[11px] font-bold text-teal-700">Ready to simulate</span>
          </div>
          <p class="text-xs text-teal-800 leading-relaxed">
            Click any clinical scenario preset below to trigger the 5-step pipeline and test OCR, strict reference ranges, and fallback handling:
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <!-- Preset 1: Ananya Rao Antenatal Panel -->
            <button 
              type="button" 
              onclick="window.app.triggerSamplePipeline('ananya_antenatal')"
              ${isProcessing ? 'disabled' : ''}
              class="p-3.5 bg-white hover:bg-teal-50/50 border border-teal-200 rounded-xl text-left shadow-2xs transition group"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-900 group-hover:text-teal-700">Ananya Rao — Antenatal Panel (PDF)</span>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">Normal / Low</span>
              </div>
              <div class="text-[11px] text-slate-500 mt-1">Gestational wk 24. Low Hemoglobin (10.6 g/dL) and Ferritin (12 ng/mL). Normal Platelets and Glucose.</div>
            </button>

            <!-- Preset 2: Rahul Mehta Comprehensive Metabolic & Lipid -->
            <button 
              type="button" 
              onclick="window.app.triggerSamplePipeline('rahul_lipid')"
              ${isProcessing ? 'disabled' : ''}
              class="p-3.5 bg-white hover:bg-teal-50/50 border border-teal-200 rounded-xl text-left shadow-2xs transition group"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-900 group-hover:text-teal-700">Rahul Mehta — Metabolic & Lipid (PDF)</span>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">High Risk</span>
              </div>
              <div class="text-[11px] text-slate-500 mt-1">Elevated HbA1c (7.6%), Fasting Blood Glucose (148 mg/dL), Total Cholesterol (218), LDL (142).</div>
            </button>

            <!-- Preset 3: Rahul Mehta Inpatient Discharge Summary -->
            <button 
              type="button" 
              onclick="window.app.triggerSamplePipeline('rahul_discharge')"
              ${isProcessing ? 'disabled' : ''}
              class="p-3.5 bg-white hover:bg-teal-50/50 border border-teal-200 rounded-xl text-left shadow-2xs transition group"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-900 group-hover:text-teal-700">Rahul Mehta — Discharge Summary (PDF)</span>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Discrepancies</span>
              </div>
              <div class="text-[11px] text-slate-500 mt-1">Lists Amlodipine 5mg (conflicts with Telmisartan 40mg) and records age 49 (patient is 48).</div>
            </button>

            <!-- Preset 4: Rahul Mehta Lipoprotein(a) Missing Range -->
            <button 
              type="button" 
              onclick="window.app.triggerSamplePipeline('rahul_cardio')"
              ${isProcessing ? 'disabled' : ''}
              class="p-3.5 bg-white hover:bg-teal-50/50 border border-teal-200 rounded-xl text-left shadow-2xs transition group"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-900 group-hover:text-teal-700">Rahul Mehta — Cardio Biomarker (PDF)</span>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">Missing Range</span>
              </div>
              <div class="text-[11px] text-slate-500 mt-1">Lipoprotein(a) without source range -> evaluated strictly as "Not provided" & "Cannot determine".</div>
            </button>

            <!-- Preset 5: Unreadable Scan Failure Simulator -->
            <button 
              type="button" 
              onclick="window.app.triggerSamplePipeline('unreadable_scan')"
              ${isProcessing ? 'disabled' : ''}
              class="p-3.5 bg-rose-50/80 hover:bg-rose-100/70 border border-rose-300 rounded-xl text-left shadow-2xs transition group sm:col-span-2"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-rose-900 group-hover:text-rose-950 flex items-center gap-1.5">
                  <i data-lucide="shield-alert" class="w-4 h-4 text-rose-600"></i> Test Unreadable Document Fallback (Simulate Degraded OCR)
                </span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900">Safety Test</span>
              </div>
              <div class="text-[11px] text-rose-800 mt-1">
                Simulates an illegible/degraded document to trigger the error state banner and the manual entry fallback button.
              </div>
            </button>
          </div>
        </div>

        <!-- Drag & Drop Zone -->
        <div 
          id="drop-zone"
          ondragover="event.preventDefault(); this.classList.add('border-teal-500', 'bg-teal-50/20');"
          ondragleave="this.classList.remove('border-teal-500', 'bg-teal-50/20');"
          ondrop="event.preventDefault(); this.classList.remove('border-teal-500', 'bg-teal-50/20'); window.app.handleFileDrop(event);"
          class="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-8 text-center bg-white transition cursor-pointer"
          onclick="document.getElementById('file-input').click();"
        >
          <input 
            type="file" 
            id="file-input" 
            class="hidden" 
            accept=".pdf,.jpg,.jpeg,.png"
            onchange="window.app.handleFileSelect(this.files)"
          />
          <div class="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-3">
            <i data-lucide="upload-cloud" class="w-7 h-7"></i>
          </div>
          <div class="text-sm font-bold text-slate-800">
            Drag and drop your medical report here, or <span class="text-teal-600 hover:underline">browse file</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Supports PDF, JPG, PNG up to 25MB</p>
          <div class="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
            <span class="flex items-center gap-1"><i data-lucide="lock" class="w-3 h-3 text-teal-600"></i> Local & Isolated</span>
            <span>•</span>
            <span class="flex items-center gap-1"><i data-lucide="shield" class="w-3 h-3 text-teal-600"></i> Strict Range Verification</span>
          </div>
        </div>
      </div>
    `;
  }
};
