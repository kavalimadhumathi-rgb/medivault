/**
 * MediVault AI - Conflicts & Inconsistencies Component (Prompt 2 MVP)
 * AI-assisted discrepancy detection across documents and patient profiles.
 * Status: "Needs Human Review" (Never automatically decides winner or changes medication)
 * Features:
 *  - "Review" button (Detailed comparison modal)
 *  - "Dismiss" button (Requires clinical justification)
 */
window.InconsistenciesComponent = {
  render(state) {
    const activePatient = state.activePatient;
    const conflicts = (state.inconsistencies || []).filter(c => !activePatient || c.patientId === activePatient.id);

    return `
      <div class="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">Conflicts & Inconsistencies</h1>
              <span class="text-[11px] font-bold px-2 py-0.5 rounded-full badge-conflict">
                ${conflicts.filter(c => c.status !== 'Resolved' && c.status !== 'Dismissed').length} Needs Human Review
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              MediVault AI flags contradictory data across documents for human review without silently overwriting medical records.
            </p>
          </div>

          <span class="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            Strict Guardrail: Never auto-resolves
          </span>
        </div>

        <!-- Conflict Cards List -->
        <div class="space-y-4">
          ${conflicts.length === 0 ? `
            <div class="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <i data-lucide="check-circle" class="w-8 h-8 text-emerald-600 mx-auto mb-2"></i>
              <h3 class="text-sm font-bold text-slate-800">No Inconsistencies Detected</h3>
              <p class="text-xs text-slate-500 mt-0.5">All source records and self-reported parameters are concordant.</p>
            </div>
          ` : conflicts.map(item => {
            const isDismissed = item.status === 'Dismissed' || item.status === 'Resolved';

            return `
              <div class="bg-white p-6 rounded-2xl border ${isDismissed ? 'border-slate-200 opacity-80' : 'border-rose-200 shadow-sm'} space-y-4">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold text-slate-900">${item.title}</span>
                      <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">${item.id}</span>
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">${item.type}</span>
                    </div>
                    <p class="text-xs text-slate-600 mt-1">${item.description}</p>
                  </div>

                  <span class="text-[11px] font-bold px-2.5 py-1 rounded-full ${isDismissed ? 'badge-verified' : 'badge-conflict'}">
                    ${item.status}
                  </span>
                </div>

                <!-- Side-by-side Conflicting Records -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <span class="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                      <i data-lucide="file" class="w-3 h-3"></i> Record A Source: ${item.recordA.source}
                    </span>
                    <div class="font-extrabold text-slate-900 text-sm">${item.recordA.value}</div>
                    <div class="text-[10px] text-slate-500 font-mono">Date: ${item.recordA.date}</div>
                  </div>

                  <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <span class="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                      <i data-lucide="file" class="w-3 h-3"></i> Record B Source: ${item.recordB.source}
                    </span>
                    <div class="font-extrabold text-slate-900 text-sm">${item.recordB.value}</div>
                    <div class="text-[10px] text-slate-500 font-mono">Date: ${item.recordB.date}</div>
                  </div>
                </div>

                <!-- Action Bar with "Review" and "Dismiss" -->
                <div class="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div class="text-slate-600">
                    <strong>Recommended Action:</strong> ${item.recommendedAction}
                  </div>

                  ${!isDismissed ? `
                    <div class="flex items-center gap-2">
                      <!-- Review Action -->
                      <button 
                        onclick="window.app.openConflictReviewModal('${item.id}')"
                        class="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition"
                      >
                        <i data-lucide="eye" class="w-3.5 h-3.5"></i> Review
                      </button>

                      <!-- Dismiss Action -->
                      <button 
                        onclick="window.app.openDismissConflictModal('${item.id}')"
                        class="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1.5 transition"
                      >
                        <i data-lucide="x" class="w-3.5 h-3.5"></i> Dismiss
                      </button>
                    </div>
                  ` : `
                    <div class="text-[11px] text-slate-500 italic">
                      Dismissed / Resolved by ${item.dismissedBy || 'Clinician'} ${item.dismissalReason ? `— Reason: "${item.dismissalReason}"` : ''}
                    </div>
                  `}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
};
