/**
 * Report Comparison Component
 * Compares two reports with neutral non-diagnostic statements.
 * Example: "The reported value increased from 96 mg/dL to 108 mg/dL."
 * Never says: "This means the patient has diabetes."
 */
window.ReportCompareComponent = {
  render(state) {
    const activePatient = state.activePatient;
    const reports = (state.reports || []).filter(r => !activePatient || r.patientId === activePatient.id);

    const rep1Id = state.compareRep1 || (reports[1] ? reports[1].id : (reports[0] ? reports[0].id : null));
    const rep2Id = state.compareRep2 || (reports[0] ? reports[0].id : null);

    const r1 = reports.find(r => r.id === rep1Id);
    const r2 = reports.find(r => r.id === rep2Id);

    const comparisonData = state.comparisonData || [];

    return `
      <div class="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
        <!-- Header & Selectors -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">Longitudinal Report Comparison</h1>
            <p class="text-xs text-slate-500 mt-0.5">
              Select two clinical reports to evaluate numerical delta changes side-by-side using objective, non-diagnostic terminology.
            </p>
          </div>

          <!-- Report Selector Dropdowns -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label class="block text-xs font-bold text-slate-700 mb-1">Baseline Report (Previous)</label>
              <select onchange="window.app.setCompareReports(this.value, '${rep2Id}')" class="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg">
                ${reports.map(r => `
                  <option value="${r.id}" ${r.id === rep1Id ? 'selected' : ''}>${r.fileName} (${r.reportDate})</option>
                `).join('')}
              </select>
              ${r1 ? `<div class="text-[11px] text-slate-500 mt-1.5 font-mono">${r1.facility} • ${r1.reportType}</div>` : ''}
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label class="block text-xs font-bold text-slate-700 mb-1">Follow-up Report (Current)</label>
              <select onchange="window.app.setCompareReports('${rep1Id}', this.value)" class="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg">
                ${reports.map(r => `
                  <option value="${r.id}" ${r.id === rep2Id ? 'selected' : ''}>${r.fileName} (${r.reportDate})</option>
                `).join('')}
              </select>
              ${r2 ? `<div class="text-[11px] text-slate-500 mt-1.5 font-mono">${r2.facility} • ${r2.reportType}</div>` : ''}
            </div>
          </div>
        </div>

        <!-- Delta Comparison Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900">Biomarker Delta Analysis</h3>
            <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full badge-extracted">Objective Comparison Only</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th class="py-3 px-4">Test Parameter</th>
                  <th class="py-3 px-4 text-right">Previous Value</th>
                  <th class="py-3 px-4 text-right">Current Value</th>
                  <th class="py-3 px-4 text-center">Observed Delta</th>
                  <th class="py-3 px-4">Objective Clinical Statement</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${comparisonData.map(item => `
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-3.5 px-4 font-bold text-slate-900">
                      ${item.testName}
                    </td>
                    <td class="py-3.5 px-4 text-right font-mono text-slate-700">
                      ${item.previous ? `${item.previous.value} ${item.previous.unit}` : '<span class="text-slate-400 italic">Not tested</span>'}
                    </td>
                    <td class="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      ${item.current ? `${item.current.value} ${item.current.unit}` : '<span class="text-slate-400 italic">Not tested</span>'}
                    </td>
                    <td class="py-3.5 px-4 text-center">
                      <span class="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                        ${item.delta || 'N/A'}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 text-slate-600 text-xs">
                      ${item.neutralStatement}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Non-Diagnostic Disclaimer Strip -->
          <div class="p-4 bg-amber-50/50 border-t border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <i data-lucide="info" class="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5"></i>
            <div>
              <strong>Safety Guardrail:</strong> Observed changes between laboratory reports are presented as numerical differences. They do not constitute diagnostic conclusions or efficacy assessments.
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
