/**
 * AI Summary Component
 * STRICT TEMPLATE AND GUARDRAILS:
 * 1. Medical Information Summary
 * 2. Patient Information
 * 3. Reported Information
 * 4. Recent Laboratory Information
 * 5. Notable Reported Values (outside source ranges)
 * 6. Missing Information (missing ranges or ambiguous units)
 * 7. Prominent Non-Diagnostic Safety Notice
 */
window.AISummaryViewComponent = {
  render(state) {
    const activePatient = state.activePatient;
    if (!activePatient) {
      return `
        <div class="p-12 text-center">
          <h2 class="text-base font-bold text-slate-800">Please select a patient to view AI summary.</h2>
          <button onclick="window.app.navigateTo('dashboard')" class="mt-4 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl">Return to Dashboard</button>
        </div>
      `;
    }

    const summary = activePatient.summary;

    return `
      <div class="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Patient-Friendly AI Summary</h1>
              <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full badge-ai-summary">Non-Diagnostic</span>
            </div>
            <p class="text-xs text-slate-500 mt-1">
              Organizes and summarizes documented records strictly without medical speculation, diagnoses, or prescriptions.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="window.app.generateAISummary('${activePatient.id}')" class="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Regenerate Summary
            </button>
            <button onclick="window.app.copyAISummary()" class="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs transition" title="Copy to clipboard">
              <i data-lucide="copy" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        ${summary ? `
          <!-- Structured Document Content Card -->
          <div id="ai-summary-content" class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed">
            
            <!-- Section 1: Patient Information -->
            <div class="pb-4 border-b border-slate-100">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Patient Information</h3>
              <div class="font-mono text-slate-800 font-semibold">${summary.content.patientInfo}</div>
            </div>

            <!-- Section 2: Reported Information -->
            <div class="pb-4 border-b border-slate-100">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reported Information</h3>
              <p class="text-slate-700">${summary.content.reportedInfo}</p>
            </div>

            <!-- Section 3: Recent Laboratory Information -->
            <div class="pb-4 border-b border-slate-100">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Laboratory Information</h3>
              <p class="text-slate-700">${summary.content.recentLabInfo}</p>
            </div>

            <!-- Section 4: Notable Reported Values -->
            <div class="pb-4 border-b border-slate-100">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notable Reported Values</h3>
              <div class="space-y-2">
                ${summary.content.notableReportedValues.map(v => `
                  <div class="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-amber-900 text-xs">
                    ${v}
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Section 5: Missing Information & Ambiguities -->
            <div class="pb-4 border-b border-slate-100">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Missing Information & Unspecified Ranges</h3>
              <div class="space-y-2">
                ${summary.content.missingInformation.map(m => `
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs">
                    • ${m}
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Section 6: Mandatory Non-Diagnostic Safety Notice -->
            <div class="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-950 flex items-start gap-3">
              <i data-lucide="shield-check" class="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5"></i>
              <div>
                <strong class="block font-bold mb-1 uppercase tracking-wide">Important Clinical Notice:</strong>
                ${summary.content.safetyNotice}
              </div>
            </div>

            <div class="text-[10px] text-slate-400 font-mono text-right">
              Generated: ${new Date(summary.generatedAt).toLocaleString()} • AI Engine v2.4 (Strict Non-Diagnostic Guardrails)
            </div>
          </div>
        ` : `
          <div class="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
            <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center mb-3">
              <i data-lucide="sparkles" class="w-6 h-6"></i>
            </div>
            <h3 class="text-sm font-bold text-slate-800">No Summary Generated Yet</h3>
            <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Click below to synthesize current patient intake and laboratory findings into a non-diagnostic summary.</p>
            <button onclick="window.app.generateAISummary('${activePatient.id}')" class="mt-4 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-sm">
              Generate Structured Summary
            </button>
          </div>
        `}
      </div>
    `;
  }
};
