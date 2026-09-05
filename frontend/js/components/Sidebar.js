/**
 * MediVault AI - Sidebar Component (Step 7: Grouped Navigation)
 * Organized into:
 *  - PATIENT (Dashboard, Patient Record, Lab Results)
 *  - ANALYSIS (Trend Charts, Report Compare, AI Summary, Conflicts & Issues)
 *  - VERIFICATION (Human Verification, Clarifications, Upload Report)
 * Retains notification badges: Human Verification: 6, Conflicts: 3.
 * Clear active-state highlighting & collapsible on smaller screens.
 */
window.SidebarComponent = {
  render(state) {
    const currentView = state.currentView;
    const activePatient = state.activePatient;
    const sidebarOpen = state.sidebarOpen !== false;

    // Grouped Navigation Items (Prompt Step 7)
    const groups = [
      {
        title: "PATIENT",
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
          { id: 'patient-record', label: 'Patient Record', icon: 'folder-heart' },
          { id: 'lab-results', label: 'Lab Results', icon: 'test-tube-2' }
        ]
      },
      {
        title: "ANALYSIS",
        items: [
          { id: 'trends', label: 'Trend Charts', icon: 'line-chart' },
          { id: 'compare', label: 'Report Compare', icon: 'git-compare' },
          { id: 'ai-summary', label: 'AI Summary', icon: 'sparkles' },
          { id: 'inconsistencies', label: 'Conflicts & Issues', icon: 'alert-triangle', badge: 3, badgeColor: 'red' }
        ]
      },
      {
        title: "VERIFICATION",
        items: [
          { id: 'verification', label: 'Human Verification', icon: 'split-square-vertical', badge: 6, badgeColor: 'amber' },
          { id: 'clarifications', label: 'Clarifications', icon: 'help-circle' },
          { id: 'upload', label: 'Upload Report', icon: 'upload-cloud' }
        ]
      }
    ];

    const bottomItems = [
      { id: 'audit', label: 'Audit History', icon: 'history' },
      { id: 'settings', label: 'Privacy & Security', icon: 'shield-check' }
    ];

    return `
      <!-- Mobile Backdrop Overlay -->
      <div 
        id="sidebar-overlay"
        onclick="window.app.toggleSidebar()"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}"
      ></div>

      <!-- Responsive Sidebar -->
      <aside class="fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 min-h-[calc(100vh-57px)] transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}">
        
        <!-- Current Patient Context Box in Sidebar -->
        ${activePatient ? `
          <div class="p-3.5 mx-3 mt-3 rounded-xl border border-teal-200/80 bg-teal-50/40">
            <div class="text-[10px] font-bold text-teal-800 uppercase tracking-wider flex items-center justify-between">
              <span>ACTIVE DOSSIER</span>
              <span class="font-mono text-slate-500">${activePatient.id}</span>
            </div>
            <div class="font-bold text-slate-900 text-xs mt-1 truncate">${activePatient.fullName}</div>
            <div class="text-[11px] text-slate-500 mt-0.5">${activePatient.age} yrs • ${activePatient.sex} • ${activePatient.bloodGroup || 'B+'}</div>
          </div>
        ` : `
          <div class="p-3 mx-3 mt-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs">
            No patient active.
          </div>
        `}

        <!-- Grouped Navigation Menu -->
        <nav class="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
          ${groups.map(group => `
            <div>
              <div class="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                ${group.title}
              </div>
              <div class="space-y-1">
                ${group.items.map(item => {
                  const isActive = currentView === item.id;
                  return `
                    <button 
                      onclick="window.app.navigateTo('${item.id}'); if(window.innerWidth < 1024) window.app.toggleSidebar();"
                      class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isActive 
                          ? 'bg-teal-50 text-teal-700 border border-teal-200/80 shadow-xs font-bold' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }"
                    >
                      <div class="flex items-center gap-2.5">
                        <i data-lucide="${item.icon}" class="w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-500'}"></i>
                        <span>${item.label}</span>
                      </div>
                      ${item.badge ? `
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.badgeColor === 'red' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                          item.badgeColor === 'amber' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-blue-100 text-blue-700 border border-blue-200'
                        }">
                          ${item.badge}
                        </span>
                      ` : ''}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}

          <!-- Lower Settings Group -->
          <div class="pt-2 border-t border-slate-100 space-y-1">
            <div class="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              SYSTEM
            </div>
            ${bottomItems.map(item => {
              const isActive = currentView === item.id;
              return `
                <button 
                  onclick="window.app.navigateTo('${item.id}'); if(window.innerWidth < 1024) window.app.toggleSidebar();"
                  class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive 
                      ? 'bg-teal-50 text-teal-700 border border-teal-200/80 shadow-xs font-bold' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }"
                >
                  <div class="flex items-center gap-2.5">
                    <i data-lucide="${item.icon}" class="w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-500'}"></i>
                    <span>${item.label}</span>
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </nav>

        <!-- Bottom Quick Actions -->
        <div class="p-3 border-t border-slate-200 space-y-2">
          <button 
            onclick="window.app.navigateTo('upload'); if(window.innerWidth < 1024) window.app.toggleSidebar();" 
            class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <i data-lucide="upload-cloud" class="w-4 h-4"></i> Upload Report
          </button>
        </div>
      </aside>
    `;
  }
};
