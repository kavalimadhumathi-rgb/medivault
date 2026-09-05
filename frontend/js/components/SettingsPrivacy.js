/**
 * Settings, Privacy & Security Component
 * Features:
 * - Session info & logout
 * - Encryption & HIPAA alignment notice
 * - Data export
 * - Permanent patient data deletion (right to erasure)
 */
window.SettingsPrivacyComponent = {
  render(state) {
    const activePatient = state.activePatient;

    return `
      <div class="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
        <!-- Header -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Security & Privacy Governance</h1>
          <p class="text-xs text-slate-500 mt-1">
            Configure access credentials, review encryption protocols, export patient data, and execute GDPR/HIPAA compliance requests.
          </p>
        </div>

        <!-- Security Architecture Card -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="lock" class="w-4 h-4 text-teal-600"></i> Encryption & Access Safeguards
            </h3>
            <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active & Enforced
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div class="font-bold text-slate-800">Transport Layer Security (TLS)</div>
              <div class="text-slate-500">All data in transit encrypted via TLS 1.3 with AES-256 GCM cipher suites.</div>
            </div>
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div class="font-bold text-slate-800">No Patient Data in URLs</div>
              <div class="text-slate-500">Sensitive patient identifiers and lab parameters are never exposed in browser URL paths.</div>
            </div>
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div class="font-bold text-slate-800">Role-Based Access Control</div>
              <div class="text-slate-500">Session authenticated as Clinical Reviewer (Dr. Emily Vance) with full audit logging.</div>
            </div>
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div class="font-bold text-slate-800">Zero Model Training</div>
              <div class="text-slate-500">Patient records are never used to train public foundation models.</div>
            </div>
          </div>
        </div>

        <!-- Data Management & Portability -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
            <i data-lucide="database" class="w-4 h-4 text-teal-600"></i> Data Portability & Rights
          </h3>

          ${activePatient ? `
            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <div class="font-bold text-slate-800">Export Active Patient Data: ${activePatient.fullName}</div>
                <div class="text-slate-500">Generate a structured JSON archive containing demographics, labs, reports, and timeline.</div>
              </div>
              <button onclick="window.app.exportPatientData('${activePatient.id}')" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-1.5">
                <i data-lucide="download" class="w-4 h-4"></i> Export Data
              </button>
            </div>

            <!-- Danger Zone: Permanent Patient Deletion -->
            <div class="p-5 bg-rose-50/60 rounded-2xl border border-rose-200 text-xs space-y-3">
              <div class="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <i data-lucide="alert-octagon" class="w-5 h-5"></i> Danger Zone: Permanent Patient Purge
              </div>
              <p class="text-rose-700 leading-relaxed">
                Permanently deletes <strong>${activePatient.fullName} (${activePatient.id})</strong> and all associated medical reports, lab results, and conflicts from this server. This action cannot be undone.
              </p>
              <div class="pt-2">
                <button 
                  onclick="window.app.handleDeletePatient('${activePatient.id}')"
                  class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
                >
                  <i data-lucide="trash-2" class="w-4 h-4"></i> Permanently Purge Patient Data
                </button>
              </div>
            </div>
          ` : `
            <div class="text-xs text-slate-400 italic">Select an active patient to manage their specific records.</div>
          `}
        </div>

        <!-- Safety & Legal Notice -->
        <div class="p-5 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
          <div class="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Notice of Clinical Limitations</div>
          <p>
            MediVault AI is designed strictly to facilitate medical information organization, verification, and longitudinal understanding. It is not an approved medical diagnostic device. Healthcare providers must exercise independent professional clinical judgment when reviewing organized records.
          </p>
        </div>
      </div>
    `;
  }
};
