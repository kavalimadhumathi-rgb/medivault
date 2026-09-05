/**
 * MediVault AI - Laboratory Results Table Component (Prompt 2 MVP)
 * Features:
 *  - Search bar (Real-time filter by test name, unit, or status)
 *  - Sort by column (Test Name, Date, Value, Status)
 *  - Filter by status (All, Normal, High, Low, Cannot determine)
 *  - Filter by verification state (All, Pending Review, Verified, Edited, Rejected, Needs Clarification)
 *  - Strict reference range rule: "Not provided" & "Cannot determine"
 *  - Click row to open Provenance Drawer
 */
window.LabResultsTableComponent = {
  render(state) {
    const activePatient = state.activePatient;
    let labs = (state.labs || []).filter(l => !activePatient || l.patientId === activePatient.id);

    // Filter by search query
    const searchQuery = (state.labSearchQuery || '').toLowerCase();
    if (searchQuery) {
      labs = labs.filter(l => 
        l.testName.toLowerCase().includes(searchQuery) ||
        (l.category && l.category.toLowerCase().includes(searchQuery)) ||
        (l.status && l.status.toLowerCase().includes(searchQuery)) ||
        (l.value && String(l.value).toLowerCase().includes(searchQuery))
      );
    }

    // Filter by status
    const statusFilter = state.labStatusFilter || '';
    if (statusFilter) {
      labs = labs.filter(l => l.status === statusFilter);
    }

    // Filter by verification state
    const verFilter = state.labVerificationFilter || '';
    if (verFilter) {
      labs = labs.filter(l => (l.verificationStatus || 'Pending Review') === verFilter);
    }

    // Sort
    const sortField = state.labSortField || 'testDate';
    const sortAsc = state.labSortAsc !== undefined ? state.labSortAsc : false;
    labs.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <!-- Table Control Toolbar -->
        <div class="p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 class="text-base font-bold text-slate-900">Structured Laboratory Results</h3>
            <p class="text-xs text-slate-500 mt-0.5">Click any test row to inspect full provenance, source document snippet, and audit history.</p>
          </div>

          <!-- Controls: Search, Status Filter, Verification Filter -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Search -->
            <div class="relative">
              <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Search tests..." 
                value="${state.labSearchQuery || ''}"
                oninput="window.app.setLabSearch(this.value)"
                class="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 w-44 focus:outline-teal-500"
              />
            </div>

            <!-- Status Filter -->
            <select 
              onchange="window.app.setLabStatusFilter(this.value)" 
              class="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
            >
              <option value="">Status: All</option>
              <option value="Normal" ${statusFilter === 'Normal' ? 'selected' : ''}>Normal</option>
              <option value="High" ${statusFilter === 'High' ? 'selected' : ''}>High</option>
              <option value="Low" ${statusFilter === 'Low' ? 'selected' : ''}>Low</option>
              <option value="Cannot determine" ${statusFilter === 'Cannot determine' ? 'selected' : ''}>Cannot determine</option>
            </select>

            <!-- Verification Filter -->
            <select 
              onchange="window.app.setLabVerificationFilter(this.value)" 
              class="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
            >
              <option value="">Verification: All</option>
              <option value="Pending Review" ${verFilter === 'Pending Review' ? 'selected' : ''}>Pending Review</option>
              <option value="Verified" ${verFilter === 'Verified' ? 'selected' : ''}>Verified</option>
              <option value="Edited" ${verFilter === 'Edited' ? 'selected' : ''}>Edited</option>
              <option value="Rejected" ${verFilter === 'Rejected' ? 'selected' : ''}>Rejected</option>
              <option value="Needs Clarification" ${verFilter === 'Needs Clarification' ? 'selected' : ''}>Needs Clarification</option>
            </select>

            <!-- Manual Entry button -->
            <button 
              onclick="window.app.openManualLabEntryModal()" 
              class="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1"
            >
              <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Lab
            </button>
          </div>
        </div>

        <!-- Table View -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th class="py-3 px-4 cursor-pointer hover:text-slate-900" onclick="window.app.toggleLabSort('testName')">
                  Test Name <i data-lucide="arrow-up-down" class="w-3 h-3 inline"></i>
                </th>
                <th class="py-3 px-4 text-right cursor-pointer hover:text-slate-900" onclick="window.app.toggleLabSort('value')">
                  Result <i data-lucide="arrow-up-down" class="w-3 h-3 inline"></i>
                </th>
                <th class="py-3 px-4">Unit</th>
                <th class="py-3 px-4">Source Reference Range</th>
                <th class="py-3 px-4 cursor-pointer hover:text-slate-900" onclick="window.app.toggleLabSort('status')">
                  Status <i data-lucide="arrow-up-down" class="w-3 h-3 inline"></i>
                </th>
                <th class="py-3 px-4 cursor-pointer hover:text-slate-900" onclick="window.app.toggleLabSort('testDate')">
                  Date <i data-lucide="arrow-up-down" class="w-3 h-3 inline"></i>
                </th>
                <th class="py-3 px-4">Provenance</th>
                <th class="py-3 px-4">Verification</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${labs.length === 0 ? `
                <tr>
                  <td colspan="9" class="p-8 text-center text-slate-400 italic">No laboratory results match your filters.</td>
                </tr>
              ` : labs.map(lab => {
                const isHigh = lab.status === 'High';
                const isLow = lab.status === 'Low';
                const isCannotDetermine = lab.status === 'Cannot determine';
                const vStatus = lab.verificationStatus || 'Pending Review';

                return `
                  <tr class="hover:bg-teal-50/40 transition">
                    <td class="py-3.5 px-4 font-bold text-slate-800 cursor-pointer" onclick="window.app.openProvenanceDrawer('${lab.id}')">
                      <div>${lab.testName}</div>
                      <div class="text-[10px] text-slate-400 font-normal">${lab.category || 'Clinical Panel'}</div>
                    </td>
                    <td class="py-3.5 px-4 text-right font-extrabold text-slate-900 font-mono text-sm cursor-pointer" onclick="window.app.openProvenanceDrawer('${lab.id}')">
                      ${lab.value}
                    </td>
                    <td class="py-3.5 px-4 text-slate-600 font-medium">
                      ${lab.unit}
                    </td>
                    <td class="py-3.5 px-4 text-slate-600">
                      ${lab.referenceRange && lab.referenceRange !== 'Not provided' ? `
                        <span class="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">${lab.referenceRange}</span>
                      ` : `
                        <span class="text-slate-400 italic font-mono">Not provided</span>
                      `}
                    </td>
                    <td class="py-3.5 px-4">
                      ${isCannotDetermine ? `
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200" title="Source report did not provide reference range">
                          Cannot determine
                        </span>
                      ` : `
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isHigh ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                          isLow ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }">
                          ${lab.status}
                        </span>
                      `}
                    </td>
                    <td class="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      ${lab.testDate}
                    </td>
                    <td class="py-3.5 px-4">
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full badge-source-extracted">
                        ${lab.provenance || 'SOURCE EXTRACTED'}
                      </span>
                    </td>
                    <td class="py-3.5 px-4">
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        vStatus === 'Verified' || vStatus === 'Verified by User' ? 'badge-verified' :
                        vStatus === 'Edited' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                        vStatus === 'Rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        vStatus === 'Needs Clarification' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'badge-needs-verification'
                      }">
                        ${vStatus}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 text-right">
                      <div class="flex items-center justify-end gap-1.5">
                        <button 
                          onclick="window.app.openProvenanceDrawer('${lab.id}')"
                          class="p-1 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-100 transition"
                          title="View complete source provenance"
                        >
                          <i data-lucide="info" class="w-4 h-4"></i>
                        </button>
                        <button 
                          onclick="window.app.openEditLabModal('${lab.id}')"
                          class="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                          title="Edit value"
                        >
                          <i data-lucide="edit-2" class="w-4 h-4"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              })}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};
