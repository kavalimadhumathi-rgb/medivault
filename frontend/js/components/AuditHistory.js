/**
 * Audit History Component
 * Immutable ledger tracking all creations, uploads, extractions, field edits, and verifications.
 */
window.AuditHistoryComponent = {
  render(state) {
    const logs = state.auditLogs || [];

    return `
      <div class="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
        <!-- Header -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">Audit Trail & Compliance Log</h1>
            <p class="text-xs text-slate-500 mt-0.5">
              Cryptographically traceable event log recording all patient record mutations, extractions, and verifications.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Filter audit log..." 
              oninput="window.app.filterAuditLogs(this.value)"
              class="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl w-60"
            />
          </div>
        </div>

        <!-- Audit Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th class="py-3 px-4">Date / Time</th>
                  <th class="py-3 px-4">User / Agent</th>
                  <th class="py-3 px-4">Action</th>
                  <th class="py-3 px-4">Affected Record</th>
                  <th class="py-3 px-4">Previous State</th>
                  <th class="py-3 px-4">New State</th>
                  <th class="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody id="audit-table-body" class="divide-y divide-slate-100">
                ${logs.map(log => `
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      ${new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td class="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                      ${log.user}
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap">
                      <span class="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        ${log.action}
                      </span>
                    </td>
                    <td class="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                      ${log.affectedRecord}
                    </td>
                    <td class="py-3 px-4 text-slate-400 font-mono text-[11px] truncate max-w-[120px]">
                      ${log.previousValue}
                    </td>
                    <td class="py-3 px-4 text-teal-800 font-mono text-[11px] font-semibold truncate max-w-[140px]">
                      ${log.newValue}
                    </td>
                    <td class="py-3 px-4 text-slate-500 text-xs">
                      ${log.notes}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>${logs.length} Total audit events recorded.</span>
            <span class="font-mono text-slate-400">HIPAA Audit Trail Rule 164.312(b) Aligned</span>
          </div>
        </div>
      </div>
    `;
  }
};
