/**
 * Navigation Bar Component
 */
window.NavbarComponent = {
  render(state) {
    const activePatient = state.activePatient;
    return `
      <header class="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 py-3 flex items-center justify-between">
        <!-- Brand & Mobile Toggle -->
        <div class="flex items-center gap-3">
          <button onclick="window.app.toggleSidebar()" class="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
            <i data-lucide="menu" class="w-5 h-5"></i>
          </button>
          <div class="flex items-center gap-2.5 cursor-pointer" onclick="window.app.navigateTo('dashboard')">
            <div class="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-600/20">
              <i data-lucide="shield-plus" class="w-5 h-5"></i>
            </div>
            <div class="hidden sm:block">
              <span class="text-lg font-bold tracking-tight text-slate-900">MediVault <span class="text-teal-600">AI</span></span>
            </div>
          </div>

          <!-- Demo Data Indicator Badge -->
          <span class="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <i data-lucide="database" class="w-3 h-3"></i>
            DEMO DATA — NOT REAL PATIENT INFO
          </span>
        </div>

        <!-- Center: Active Patient Switcher -->
        <div class="flex items-center gap-2">
          ${activePatient ? `
            <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
              <i data-lucide="user" class="w-4 h-4 text-teal-600"></i>
              <span class="text-xs font-medium text-slate-500 hidden sm:inline">Active:</span>
              <span class="text-xs font-bold text-slate-800">${activePatient.fullName}</span>
              <span class="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">${activePatient.id}</span>
              <button onclick="window.app.openPatientSwitcher()" class="ml-1 text-slate-400 hover:text-slate-700" title="Switch Patient">
                <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          ` : `
            <button onclick="window.app.openPatientSwitcher()" class="text-xs text-slate-600 hover:text-teal-600 font-semibold px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5">
              <i data-lucide="users" class="w-3.5 h-3.5"></i> Select Patient
            </button>
          `}
        </div>

        <!-- Right: Search Trigger & User Profile -->
          <a href="./index.html" class="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5 border border-emerald-200 transition" title="Switch to PulseCare 360">
            <i data-lucide="activity" class="w-3.5 h-3.5"></i>
            <span class="hidden sm:inline">PulseCare 360</span>
          </a>

          <button onclick="window.app.openSearchModal()" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium flex items-center gap-2 border border-slate-200 transition">
            <i data-lucide="search" class="w-3.5 h-3.5"></i>
            <span class="hidden md:inline">Search records...</span>
            <kbd class="hidden md:inline px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded font-mono text-slate-500">⌘K</kbd>
          </button>

          <!-- Current Doctor Profile -->
          <div class="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div class="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs border border-teal-200">
              EV
            </div>
            <div class="hidden xl:block text-left">
              <div class="text-xs font-bold text-slate-800 leading-tight">Dr. Emily Vance</div>
              <div class="text-[10px] text-slate-500 leading-tight">Care Coordinator</div>
            </div>
          </div>
        </div>
      </header>
    `;
  }
};
