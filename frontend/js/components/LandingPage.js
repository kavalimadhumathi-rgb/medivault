/**
 * Landing Page Component
 */
window.LandingPageComponent = {
  render() {
    return `
      <div class="min-h-screen bg-slate-50 flex flex-col justify-between">
        <!-- Header -->
        <header class="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <i data-lucide="shield-plus" class="w-6 h-6"></i>
            </div>
            <div>
              <span class="text-xl font-bold tracking-tight text-slate-900">MediVault <span class="text-teal-600">AI</span></span>
              <span class="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">Clinical Edition</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <button onclick="window.app.navigateTo('dashboard')" class="text-sm font-semibold text-slate-600 hover:text-teal-600 transition px-3 py-2">
              View Demo
            </button>
            <button onclick="window.app.navigateTo('dashboard')" class="text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-2">
              Get Started <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
        </header>

        <!-- Hero Section -->
        <main class="flex-1 max-w-6xl mx-auto px-6 pt-16 pb-20 text-center flex flex-col items-center">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-6">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
            Responsible Healthcare Information Intelligence
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-tight sm:leading-none">
            Turn Scattered Medical Reports Into <span class="text-teal-600">One Clear Patient Record</span>
          </h1>

          <p class="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
            MediVault AI organizes patient information, extracts important details from medical reports, and creates a traceable medical record that is easier to review and understand.
          </p>

          <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button onclick="window.app.navigateTo('dashboard')" class="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg shadow-teal-600/25 transition flex items-center gap-2 text-base">
              Get Started
              <i data-lucide="chevron-right" class="w-5 h-5"></i>
            </button>
            <button onclick="window.app.loadDemoPatient('P-10491')" class="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold shadow-sm hover:bg-slate-50 transition flex items-center gap-2 text-base">
              <i data-lucide="play-circle" class="w-5 h-5 text-teal-600"></i>
              Explore Interactive Demo
            </button>
          </div>

          <!-- Feature Cards Grid (6 Main Capabilities) -->
          <div class="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left w-full">
            <!-- 1. AI Report Extraction -->
            <div class="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <i data-lucide="file-search" class="w-6 h-6"></i>
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-2">1. AI Report Extraction</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Extracts test names, numeric values, units, reference intervals, and observation dates directly from unstructured blood tests, urinalysis, and clinical notes.
              </p>
            </div>

            <!-- 2. Structured Patient Records -->
            <div class="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div class="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <i data-lucide="layout-grid" class="w-6 h-6"></i>
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-2">2. Structured Patient Records</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Aggregates patient demographics, user-provided medical histories, and laboratory data into a unified, accessible clinical directory.
              </p>
            </div>

            <!-- 3. Source & Provenance -->
            <div class="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <i data-lucide="git-branch" class="w-6 h-6"></i>
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-2">3. Source & Provenance</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Every data item carries an indelible audit trail with original document filename, page number, AI confidence tier, and verification badge.
              </p>
            </div>

            <!-- 4. Reference-Range Awareness -->
            <div class="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <i data-lucide="sliders" class="w-6 h-6"></i>
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-2">4. Reference-Range Awareness</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Never invents or guesses reference ranges. Compares results strictly against ranges explicitly provided in the source test facility's report.
              </p>
            </div>

            <!-- 5. Human Verification -->
            <div class="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <i data-lucide="user-check" class="w-6 h-6"></i>
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-2">5. Human Verification</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Side-by-side split screen document review allows clinical reviewers to accept, edit, or reject extracted fields before adding them to permanent records.
              </p>
            </div>

            <!-- 6. Patient-Friendly Summaries -->
            <div class="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <i data-lucide="file-text" class="w-6 h-6"></i>
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-2">6. Patient-Friendly Summaries</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Generates clear, plain-language clinical overviews adhering to strict non-diagnostic and non-prescriptive safety constraints.
              </p>
            </div>
          </div>

          <!-- Responsible AI & Safety Notice Banner -->
          <div class="mt-16 w-full p-6 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-left flex items-start gap-4">
            <div class="p-2 bg-amber-100 text-amber-800 rounded-lg flex-shrink-0 mt-0.5">
              <i data-lucide="alert-triangle" class="w-5 h-5"></i>
            </div>
            <div>
              <h4 class="text-sm font-bold text-amber-900 uppercase tracking-wide">Responsible Healthcare AI & Safety Notice</h4>
              <p class="mt-1 text-xs sm:text-sm text-amber-800 leading-relaxed">
                MediVault AI is an <strong>information organization and summarization tool only</strong>. It does <strong>not</strong> diagnose diseases, recommend medications or dosage changes, prescribe treatments, or present uncertain AI hypotheses as medical facts. All extracted medical information must be verified against original clinical source documentation by a qualified healthcare professional.
              </p>
            </div>
          </div>
        </main>

        <!-- Footer -->
        <footer class="bg-white border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-500">
          <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-800">MediVault AI</span>
              <span>• Healthcare Data Management System</span>
            </div>
            <div class="text-slate-400">
              DEMO DATA — NOT REAL PATIENT INFORMATION • HIPAA / Privacy Aligned Architecture
            </div>
          </div>
        </footer>
      </div>
    `;
  }
};
