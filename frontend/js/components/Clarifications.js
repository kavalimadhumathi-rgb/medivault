/**
 * Clarification Questions Component
 * Prompts user when source values are ambiguous (e.g. missing units).
 * Strictly enforces: System must never guess missing information.
 */
window.ClarificationsComponent = {
  render(state) {
    const activePatient = state.activePatient;
    const clarifications = (state.clarifications || []).filter(c => !activePatient || c.patientId === activePatient.id);

    return `
      <div class="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
        <!-- Header -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">Clarification Queue</h1>
              <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                ${clarifications.filter(c => c.status !== 'Answered').length} Pending
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              The AI highlights ambiguous parameters (such as unstated units or conflicting prescriptions) so humans can clarify.
            </p>
          </div>
          <span class="text-xs text-slate-400 font-mono">Zero guessing rule</span>
        </div>

        <!-- Clarification Cards List -->
        <div class="space-y-4">
          ${clarifications.map(item => {
            const isAnswered = item.status === 'Answered';
            return `
              <div class="bg-white p-6 rounded-2xl border ${isAnswered ? 'border-slate-200 opacity-75' : 'border-blue-200 shadow-sm'} space-y-4">
                <div class="flex items-start justify-between">
                  <div class="flex items-start gap-3">
                    <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <i data-lucide="help-circle" class="w-5 h-5"></i>
                    </div>
                    <div>
                      <div class="text-xs font-bold text-blue-700 uppercase tracking-wide">Clarification Needed: ${item.field}</div>
                      <div class="text-sm font-bold text-slate-900 mt-0.5">${item.question}</div>
                      <div class="text-[11px] text-slate-500 font-mono mt-1">Source: ${item.sourceDoc} • Page ${item.page || 1}</div>
                    </div>
                  </div>

                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${isAnswered ? 'badge-verified' : 'badge-needs-verification'}">
                    ${item.status}
                  </span>
                </div>

                ${!isAnswered ? `
                  <!-- Options for User Selection -->
                  <div class="pt-2 border-t border-slate-100">
                    <div class="text-xs font-semibold text-slate-700 mb-2">Select confirmed value from original source:</div>
                    <div class="flex flex-wrap items-center gap-2">
                      ${item.options.map(opt => `
                        <button 
                          onclick="window.app.answerClarification('${item.id}', '${opt}')"
                          class="px-3 py-1.5 text-xs font-semibold bg-slate-50 hover:bg-teal-50 text-slate-800 hover:text-teal-800 border border-slate-200 hover:border-teal-300 rounded-xl transition"
                        >
                          ${opt}
                        </button>
                      `).join('')}
                    </div>
                  </div>
                ` : `
                  <div class="pt-2 border-t border-slate-100 text-xs text-emerald-800 flex items-center gap-2">
                    <i data-lucide="check" class="w-4 h-4 text-emerald-600"></i>
                    <span>Confirmed as: <strong>${item.selectedAnswer}</strong> (by ${item.answeredBy || 'Dr. Emily Vance'})</span>
                  </div>
                `}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
};
