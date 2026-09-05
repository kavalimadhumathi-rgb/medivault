/**
 * MediVault AI - Application Orchestrator & State Manager (Prompt 2 MVP)
 * Full authentication, 1-click demo logins, patient editing, unreadable report fallback,
 * conflict dismissal with clinical audit trail, and rich split-screen verification.
 */
class MediVaultApp {
  constructor() {
    this.state = {
      currentView: 'landing', // 'landing', 'dashboard', 'patient-record', 'add-patient', 'upload', 'verification', 'lab-results', 'trends', 'compare', 'ai-summary', 'inconsistencies', 'clarifications', 'audit', 'settings'
      activePatient: null,
      patients: [],
      reports: [],
      labs: [],
      inconsistencies: [],
      clarifications: [],
      timeline: [],
      auditLogs: [],
      recordTab: 'overview',
      selectedVerificationReportId: null,
      compareRep1: null,
      compareRep2: null,
      comparisonData: [],
      sidebarOpen: true,
      uploadProgress: null,
      searchQuery: '',
      labSearchQuery: '',
      labStatusFilter: '',
      labVerificationFilter: '',
      labSortField: 'testDate',
      labSortAsc: false,
      // Authentication State
      currentUser: {
        id: "USR-001",
        name: "Dr. Emily Vance",
        email: "emily.vance@medivault.clinic",
        role: "Care Coordinator & Clinical Reviewer",
        facility: "Metropolitan Healthcare Center"
      },
      isLoggedIn: true
    };

    window.app = this;
  }

  async init() {
    try {
      // Check auth status
      try {
        const resMe = await fetch('/api/auth/me');
        if (resMe.ok) {
          const authData = await resMe.json();
          if (authData.user) {
            this.state.currentUser = authData.user;
            this.state.isLoggedIn = true;
          }
        }
      } catch (e) {
        console.warn("Auth check fallback:", e);
      }

      // Fetch patient directory
      let apiConnected = false;
      try {
        const resPatients = await fetch('/api/patients');
        if (resPatients.ok) {
          this.state.patients = await resPatients.json();
          apiConnected = true;
        }
      } catch (e) {}

      // If backend not reached, load from standalone embedded clinical store
      if (!apiConnected || !this.state.patients || this.state.patients.length === 0) {
        if (window.STANDALONE_STORE) {
          this.state.patients = JSON.parse(JSON.stringify(window.STANDALONE_STORE.patients));
          this.state.reports = JSON.parse(JSON.stringify(window.STANDALONE_STORE.reports));
          this.state.labs = JSON.parse(JSON.stringify(window.STANDALONE_STORE.labs));
          this.state.inconsistencies = JSON.parse(JSON.stringify(window.STANDALONE_STORE.inconsistencies));
          this.state.clarifications = JSON.parse(JSON.stringify(window.STANDALONE_STORE.clarifications));
          this.state.timeline = JSON.parse(JSON.stringify(window.STANDALONE_STORE.timeline));
          this.state.auditLogs = JSON.parse(JSON.stringify(window.STANDALONE_STORE.auditLogs));
        }
      } else {
        // Connected to server
        try {
          const resReportsAll = await fetch('/api/reports');
          if (resReportsAll.ok) this.state.reports = await resReportsAll.json();
        } catch (e) {}

        try {
          const resAudit = await fetch('/api/audit');
          if (resAudit.ok) this.state.auditLogs = await resAudit.json();
        } catch (e) {}
      }

      // Default active patient to Rahul Mehta (P-10491) or first patient
      if (this.state.patients.length > 0) {
        const defaultPatient = this.state.patients.find(p => p.id === 'P-10491') || 
                               this.state.patients.find(p => p.id === 'P-10490') || 
                               this.state.patients[0];
        await this.selectPatient(defaultPatient.id, false);
      }

      // Setup Keyboard shortcuts (Cmd+K)
      window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          this.openSearchModal();
        }
        if (e.key === 'Escape') {
          this.closeModal();
        }
      });

      this.render();
    } catch (err) {
      console.error("Initialization error:", err);
      this.render();
    }
  }

  async selectPatient(patientId, shouldRender = true) {
    let loadedFromApi = false;
    try {
      const resP = await fetch(`/api/patients/${patientId}`);
      if (resP.ok) {
        this.state.activePatient = await resP.json();
        loadedFromApi = true;
      }
    } catch (e) {}

    if (!loadedFromApi) {
      const found = (this.state.patients || []).find(p => p.id === patientId);
      if (found) {
        this.state.activePatient = found;
      }
    }

    try {
      const resLabs = await fetch(`/api/patients/${patientId}/labs`);
      if (resLabs.ok) {
        this.state.labs = await resLabs.json();
      } else throw new Error();
    } catch (e) {
      if (window.STANDALONE_STORE) {
        this.state.labs = window.STANDALONE_STORE.labs.filter(l => l.patientId === patientId);
      }
    }

    try {
      const resReports = await fetch(`/api/patients/${patientId}/reports`);
      if (resReports.ok) {
        this.state.reports = await resReports.json();
      } else throw new Error();
    } catch (e) {
      if (window.STANDALONE_STORE) {
        this.state.reports = window.STANDALONE_STORE.reports.filter(r => r.patientId === patientId);
      }
    }

    if (this.state.reports && this.state.reports.length > 0) {
      this.state.selectedVerificationReportId = this.state.reports[0].id;
      this.state.compareRep1 = this.state.reports[1] ? this.state.reports[1].id : this.state.reports[0].id;
      this.state.compareRep2 = this.state.reports[0].id;
      await this.fetchComparisonData();
    }

    try {
      const resInconst = await fetch(`/api/patients/${patientId}/inconsistencies`);
      if (resInconst.ok) {
        this.state.inconsistencies = await resInconst.json();
      } else throw new Error();
    } catch (e) {
      if (window.STANDALONE_STORE) {
        this.state.inconsistencies = window.STANDALONE_STORE.inconsistencies.filter(c => c.patientId === patientId);
      }
    }

    try {
      const resClarify = await fetch(`/api/patients/${patientId}/clarifications`);
      if (resClarify.ok) {
        this.state.clarifications = await resClarify.json();
      } else throw new Error();
    } catch (e) {
      if (window.STANDALONE_STORE) {
        this.state.clarifications = window.STANDALONE_STORE.clarifications.filter(c => c.patientId === patientId);
      }
    }

    try {
      const resTimeline = await fetch(`/api/patients/${patientId}/timeline`);
      if (resTimeline.ok) {
        this.state.timeline = await resTimeline.json();
      } else throw new Error();
    } catch (e) {
      if (window.STANDALONE_STORE) {
        this.state.timeline = window.STANDALONE_STORE.timeline.filter(t => t.patientId === patientId);
      }
    }

    if (shouldRender) {
      this.render();
    }
  }

  async fetchComparisonData() {
    if (!this.state.activePatient || !this.state.compareRep1 || !this.state.compareRep2) return;
    try {
      const res = await fetch(`/api/patients/${this.state.activePatient.id}/compare?rep1=${this.state.compareRep1}&rep2=${this.state.compareRep2}`);
      if (res.ok) {
        const data = await res.json();
        this.state.comparisonData = data.comparison || [];
      }
    } catch (e) {
      console.error("Comparison fetch error:", e);
    }
  }

  navigateTo(view) {
    // Protected routes check
    const protectedViews = ['dashboard', 'patient-record', 'upload', 'verification', 'lab-results', 'trends', 'compare', 'ai-summary', 'inconsistencies', 'clarifications', 'audit', 'settings'];
    if (protectedViews.includes(view) && !this.state.isLoggedIn) {
      this.showToast("Please log in to access clinical records", "info");
      this.showAuthModal('login');
      return;
    }

    this.state.currentView = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  }

  loadDemoPatient(patientId) {
    this.selectPatient(patientId).then(() => {
      this.navigateTo('patient-record');
      this.showToast(`Switched to patient ${this.state.activePatient.fullName}`, 'info');
    });
  }

  setRecordTab(tab) {
    this.state.recordTab = tab;
    this.render();
  }

  toggleSidebar() {
    this.state.sidebarOpen = !this.state.sidebarOpen;
    this.render();
  }

  setVerificationReport(reportId) {
    this.state.selectedVerificationReportId = reportId;
    this.render();
  }

  // --- Authentication Handlers ---
  showAuthModal(tab = 'login') {
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-scale-up">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-teal-800 to-slate-900 p-6 text-white text-center relative">
            <button onclick="window.app.closeModal()" class="absolute right-4 top-4 text-slate-300 hover:text-white p-1 rounded-lg">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div class="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center mx-auto mb-2 text-teal-300">
              <i data-lucide="shield-plus" class="w-6 h-6"></i>
            </div>
            <h2 class="text-xl font-extrabold tracking-tight">MediVault AI Authentication</h2>
            <p class="text-xs text-teal-200/80 mt-1">Secure Clinical Record Information Platform</p>
          </div>

          <!-- Auth Tabs -->
          <div class="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
            <button onclick="window.app.showAuthModal('login')" class="flex-1 py-3 text-center border-b-2 ${tab === 'login' ? 'border-teal-600 text-teal-700 bg-white font-extrabold' : 'border-transparent hover:text-slate-900'}">
              Log In
            </button>
            <button onclick="window.app.showAuthModal('signup')" class="flex-1 py-3 text-center border-b-2 ${tab === 'signup' ? 'border-teal-600 text-teal-700 bg-white font-extrabold' : 'border-transparent hover:text-slate-900'}">
              Sign Up
            </button>
            <button onclick="window.app.showAuthModal('forgot')" class="flex-1 py-3 text-center border-b-2 ${tab === 'forgot' ? 'border-teal-600 text-teal-700 bg-white font-extrabold' : 'border-transparent hover:text-slate-900'}">
              Forgot
            </button>
          </div>

          <div class="p-6 space-y-4">
            <!-- 1-Click Demo Accounts -->
            <div class="bg-teal-50/70 p-3.5 rounded-2xl border border-teal-200/80 space-y-2">
              <span class="text-[10px] font-bold uppercase text-teal-800 tracking-wider flex items-center gap-1">
                <i data-lucide="zap" class="w-3 h-3 text-teal-600"></i> Instant 1-Click Demo Accounts:
              </span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button 
                  onclick="window.app.demoLogin('emily.vance@medivault.clinic', 'clinician123')"
                  class="p-2 bg-white hover:bg-teal-50 border border-teal-200 rounded-xl text-left transition shadow-2xs"
                >
                  <div class="text-[11px] font-bold text-slate-800">Dr. Emily Vance</div>
                  <div class="text-[9px] text-slate-500">Care Coordinator</div>
                </button>
                <button 
                  onclick="window.app.demoLogin('marcus.thorne@medivault.clinic', 'physician123')"
                  class="p-2 bg-white hover:bg-teal-50 border border-teal-200 rounded-xl text-left transition shadow-2xs"
                >
                  <div class="text-[11px] font-bold text-slate-800">Dr. Marcus Thorne</div>
                  <div class="text-[9px] text-slate-500">Attending Physician</div>
                </button>
              </div>
            </div>

            <!-- Login View -->
            ${tab === 'login' ? `
              <form onsubmit="window.app.handleLoginForm(event)" class="space-y-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input type="email" name="email" required value="emily.vance@medivault.clinic" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-teal-500" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input type="password" name="password" required value="clinician123" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-teal-500" />
                </div>
                <button type="submit" class="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-sm transition">
                  Sign In to Dashboard
                </button>
              </form>
            ` : ''}

            <!-- Signup View -->
            ${tab === 'signup' ? `
              <form onsubmit="window.app.handleSignupForm(event)" class="space-y-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input type="text" name="name" required placeholder="Dr. Sarah Connor" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-teal-500" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input type="email" name="email" required placeholder="sarah.connor@hospital.org" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-teal-500" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input type="password" name="password" required placeholder="••••••••" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-teal-500" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Clinical Role</label>
                  <input type="text" name="role" placeholder="Resident Physician / Reviewer" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-teal-500" />
                </div>
                <button type="submit" class="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-sm transition">
                  Create Clinical Account
                </button>
              </form>
            ` : ''}

            <!-- Forgot Password View -->
            ${tab === 'forgot' ? `
              <form onsubmit="window.app.handleForgotForm(event)" class="space-y-3">
                <p class="text-xs text-slate-500">Enter your clinical email and we'll generate a password reset token.</p>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input type="email" name="email" required placeholder="physician@clinic.org" class="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-teal-500" />
                </div>
                <button type="submit" class="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-sm transition">
                  Send Reset Link
                </button>
              </form>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  async demoLogin(email, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        this.state.currentUser = data.user;
        this.state.isLoggedIn = true;
        this.closeModal();
        this.showToast(`Logged in as ${data.user.name} (${data.user.role})`, 'success');
        this.navigateTo('dashboard');
      } else {
        this.showToast(data.error || "Login failed", 'error');
      }
    } catch (e) {
      console.error(e);
      this.showToast("Connection error during login", 'error');
    }
  }

  async handleLoginForm(e) {
    e.preventDefault();
    const form = e.target;
    await this.demoLogin(form.email.value, form.password.value);
  }

  async handleSignupForm(e) {
    e.preventDefault();
    const form = e.target;
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          password: form.password.value,
          role: form.role.value
        })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        this.state.currentUser = data.user;
        this.state.isLoggedIn = true;
        this.closeModal();
        this.showToast(`Account created for ${data.user.name}`, 'success');
        this.navigateTo('dashboard');
      } else {
        this.showToast(data.error || "Signup failed", 'error');
      }
    } catch (e) {
      this.showToast("Signup error", 'error');
    }
  }

  async handleForgotForm(e) {
    e.preventDefault();
    const form = e.target;
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.value })
      });
      const data = await res.json();
      if (res.ok) {
        this.showToast(data.message || "Reset token generated", 'info');
        this.showAuthModal('login');
      } else {
        this.showToast(data.error || "Error resetting password", 'error');
      }
    } catch (e) {
      this.showToast("Error processing request", 'error');
    }
  }

  async handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    this.state.isLoggedIn = false;
    this.state.currentUser = null;
    this.showToast("Logged out successfully", 'info');
    this.navigateTo('landing');
  }

  // --- Patient Switcher Modal ---
  openPatientSwitcher() {
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-scale-up">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="users" class="w-5 h-5 text-teal-600"></i> Select Active Clinical Patient
            </h3>
            <button onclick="window.app.closeModal()" class="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <div class="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            ${this.state.patients.map(p => `
              <div 
                onclick="window.app.selectPatient('${p.id}'); window.app.closeModal(); window.app.navigateTo('patient-record');"
                class="p-4 rounded-2xl border ${this.state.activePatient && this.state.activePatient.id === p.id ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20' : 'border-slate-200 hover:border-slate-300 bg-white'} cursor-pointer transition flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                    ${p.fullName.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <div class="font-bold text-sm text-slate-900">${p.fullName}</div>
                    <div class="text-xs text-slate-500 font-mono">${p.id} • ${p.age} yrs • ${p.sex}</div>
                  </div>
                </div>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full ${
                  p.verificationStatus === 'Conflicts Detected' ? 'badge-conflict' :
                  p.verificationStatus === 'Needs Review' ? 'badge-needs-verification' : 'badge-verified'
                }">
                  ${p.verificationStatus}
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // --- Edit Patient Modal (Prompt 2 MVP) ---
  openEditPatientModal(patientId) {
    const patient = this.state.patients.find(p => p.id === patientId) || this.state.activePatient;
    if (!patient) return;

    const userProv = patient.userProvided || {};
    const symptomsStr = Array.isArray(userProv.symptoms) ? userProv.symptoms.map(s => typeof s === 'string' ? s : s.text).join(', ') : (userProv.symptoms || '');
    const conditionsStr = Array.isArray(userProv.conditions) ? userProv.conditions.map(c => typeof c === 'string' ? c : c.text).join(', ') : (userProv.conditions || '');
    const allergiesStr = Array.isArray(userProv.allergies) ? userProv.allergies.map(a => typeof a === 'string' ? a : a.allergen).join(', ') : (userProv.allergies || '');
    const medsStr = Array.isArray(userProv.medications) ? userProv.medications.map(m => typeof m === 'string' ? m : `${m.name} ${m.dosage || ''}`).join(', ') : (userProv.medications || '');

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-scale-up">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <i data-lucide="user-cog" class="w-5 h-5 text-teal-600"></i> Edit Patient Record — ${patient.fullName}
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">Updates are versioned and logged to clinical audit history.</p>
            </div>
            <button onclick="window.app.closeModal()" class="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form onsubmit="window.app.saveEditPatient(event, '${patient.id}')" class="space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Full Name</label>
                <input type="text" name="fullName" value="${patient.fullName}" required class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Date of Birth</label>
                <input type="date" name="dob" value="${patient.dob}" required class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Age</label>
                <input type="number" name="age" value="${patient.age}" required class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Sex</label>
                <select name="sex" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500">
                  <option value="Female" ${patient.sex === 'Female' ? 'selected' : ''}>Female</option>
                  <option value="Male" ${patient.sex === 'Male' ? 'selected' : ''}>Male</option>
                  <option value="Other" ${patient.sex === 'Other' ? 'selected' : ''}>Other</option>
                </select>
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Contact Phone</label>
                <input type="text" name="phone" value="${patient.phone || ''}" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Email</label>
                <input type="email" name="email" value="${patient.email || ''}" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500" />
              </div>
            </div>

            <!-- Emergency Contact -->
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span class="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Emergency Contact</span>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input type="text" name="emName" placeholder="Name" value="${patient.emergencyContact ? patient.emergencyContact.name : ''}" class="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white" />
                <input type="text" name="emRel" placeholder="Relationship" value="${patient.emergencyContact ? patient.emergencyContact.relation : ''}" class="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white" />
                <input type="text" name="emPhone" placeholder="Phone" value="${patient.emergencyContact ? patient.emergencyContact.phone : ''}" class="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white" />
              </div>
            </div>

            <!-- Clinical Lists -->
            <div>
              <label class="block font-bold text-slate-700 mb-1">Symptoms (comma separated)</label>
              <textarea name="symptoms" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500">${symptomsStr}</textarea>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Diagnosed Conditions (comma separated)</label>
              <textarea name="conditions" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500">${conditionsStr}</textarea>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Allergies (comma separated)</label>
              <input type="text" name="allergies" value="${allergiesStr}" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Active Medications (comma separated)</label>
              <textarea name="medications" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500">${medsStr}</textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Past Medical History</label>
                <textarea name="medicalHistory" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500">${userProv.medicalHistory || ''}</textarea>
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Family Medical History</label>
                <textarea name="familyHistory" rows="2" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500">${userProv.familyHistory || ''}</textarea>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button type="button" onclick="window.app.closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-sm transition">
                Save Patient Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  async saveEditPatient(e, patientId) {
    e.preventDefault();
    const form = e.target;

    const payload = {
      fullName: form.fullName.value,
      dob: form.dob.value,
      age: parseInt(form.age.value, 10),
      sex: form.sex.value,
      phone: form.phone.value,
      email: form.email.value,
      emergencyContact: {
        name: form.emName.value,
        relation: form.emRel.value,
        phone: form.emPhone.value
      },
      symptoms: form.symptoms.value.split(',').map(s => s.trim()).filter(Boolean),
      conditions: form.conditions.value.split(',').map(c => c.trim()).filter(Boolean),
      allergies: form.allergies.value.split(',').map(a => a.trim()).filter(Boolean),
      medications: form.medications.value.split(',').map(m => m.trim()).filter(Boolean),
      medicalHistory: form.medicalHistory.value,
      familyHistory: form.familyHistory.value
    };

    try {
      const res = await fetch(`/api/patients/${patientId}/full`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        this.state.activePatient = updated;
        // Update in patient list
        const idx = this.state.patients.findIndex(p => p.id === patientId);
        if (idx !== -1) this.state.patients[idx] = updated;
        this.closeModal();
        this.showToast(`Updated record for ${updated.fullName}`, 'success');
        this.render();
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      // Offline fallback: update in-memory state
      const idx = this.state.patients.findIndex(p => p.id === patientId);
      if (idx !== -1) {
        this.state.patients[idx] = {
          ...this.state.patients[idx],
          ...payload,
          userProvided: {
            ...this.state.patients[idx].userProvided,
            symptoms: payload.symptoms,
            conditions: payload.conditions,
            allergies: payload.allergies,
            medications: payload.medications,
            medicalHistory: payload.medicalHistory,
            familyHistory: payload.familyHistory
          }
        };
        this.state.activePatient = this.state.patients[idx];
      }
      this.closeModal();
      this.showToast(`Updated record for ${payload.fullName}`, 'success');
      this.render();
    }
  }

  async handleCreatePatient(e) {
    e.preventDefault();
    const form = e.target;
    const dob = form.dob.value;
    const birthYear = new Date(dob).getFullYear();
    const age = new Date().getFullYear() - birthYear || 30;
    
    const newId = 'P-' + Math.floor(10500 + Math.random() * 500);
    const newPatient = {
      id: newId,
      fullName: form.fullName.value,
      dob: dob,
      age: age,
      sex: form.sex.value,
      phone: form.phone ? form.phone.value : '',
      email: form.email ? form.email.value : '',
      bloodGroup: form.bloodGroup ? form.bloodGroup.value : 'A+',
      emergencyContact: {
        name: form.emergencyContact ? form.emergencyContact.value : 'Family Contact',
        phone: form.phone ? form.phone.value : '',
        relation: 'Primary'
      },
      userProvided: {
        symptoms: form.symptoms ? form.symptoms.value.split(',').map(s => s.trim()).filter(Boolean) : [],
        conditions: form.conditions ? form.conditions.value.split(',').map(c => c.trim()).filter(Boolean) : [],
        allergies: form.allergies ? form.allergies.value.split(',').map(a => a.trim()).filter(Boolean) : [],
        medications: form.medications ? form.medications.value.split(',').map(m => m.trim()).filter(Boolean) : [],
        medicalHistory: form.medicalHistory ? form.medicalHistory.value : '',
        familyHistory: form.familyHistory ? form.familyHistory.value : ''
      },
      verifiedData: {
        labTestsCount: 0,
        unverifiedCount: 0,
        conflictsCount: 0,
        timelineEvents: 1
      },
      verificationStatus: 'Needs Review',
      assignedDoctor: this.state.currentUser ? this.state.currentUser.name : 'Dr. Emily Vance',
      lastVisit: new Date().toISOString().split('T')[0]
    };

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient)
      });
      if (res.ok) {
        const saved = await res.json();
        this.state.patients.unshift(saved);
        this.state.activePatient = saved;
      } else {
        throw new Error();
      }
    } catch (err) {
      this.state.patients.unshift(newPatient);
      this.state.activePatient = newPatient;
    }

    this.showToast(`Patient ${newPatient.fullName} (${newPatient.id}) registered successfully`, 'success');
    this.navigateTo('patient-record');
  }

  // --- Manual Lab Entry Modal (Fallback for unreadable reports) ---
  openManualLabEntryModal() {
    if (!this.state.activePatient) {
      this.showToast("Please select a patient first", "warning");
      return;
    }

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-scale-up">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <i data-lucide="edit-3" class="w-5 h-5 text-teal-600"></i> Manual Lab Entry Fallback
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">Use when a document is degraded, handwritten, or unreadable by OCR.</p>
            </div>
            <button onclick="window.app.closeModal()" class="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form onsubmit="window.app.saveManualLab(event)" class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Test Name</label>
              <input type="text" name="testName" placeholder="e.g. Fasting Blood Glucose" required class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Result Value</label>
                <input type="text" name="value" placeholder="138" required class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Unit</label>
                <input type="text" name="unit" placeholder="mg/dL" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500" />
              </div>
            </div>

            <!-- Reference Range with "Not provided" checkbox -->
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <label class="font-bold text-slate-700">Source Reference Range</label>
                <label class="flex items-center gap-1.5 text-slate-500 cursor-pointer">
                  <input type="checkbox" id="no-range-toggle" onchange="document.getElementById('ref-range-input').disabled = this.checked; if(this.checked) document.getElementById('ref-range-input').value = 'Not provided';" />
                  <span>Not provided in source</span>
                </label>
              </div>
              <input type="text" id="ref-range-input" name="referenceRange" placeholder="e.g. 70 - 99 or < 200" class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" />
              <div class="text-[10px] text-slate-500 italic">
                Strict rule: If the report provides no range, status will be recorded as "Cannot determine".
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Test Date</label>
                <input type="date" name="testDate" value="2026-09-05" required class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Category</label>
                <select name="category" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500">
                  <option value="Chemistry">Chemistry</option>
                  <option value="Hematology">Hematology</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Lipid Panel">Lipid Panel</option>
                  <option value="Urinalysis">Urinalysis</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Clinical Reason / Notes</label>
              <input type="text" name="notes" placeholder="Entered from patient handwritten glucometer log" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500" />
            </div>

            <div class="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button type="button" onclick="window.app.closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-sm transition">
                Add to Patient Record
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  async saveManualLab(e) {
    e.preventDefault();
    const form = e.target;
    const noRange = document.getElementById('no-range-toggle').checked;
    const refRange = noRange ? 'Not provided' : (form.referenceRange.value || 'Not provided');

    const payload = {
      patientId: this.state.activePatient.id,
      testName: form.testName.value,
      value: form.value.value,
      unit: form.unit.value,
      referenceRange: refRange,
      testDate: form.testDate.value,
      category: form.category.value,
      notes: form.notes.value
    };

    try {
      const res = await fetch('/api/labs/manual-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const result = await res.json();
        this.closeModal();
        this.showToast(`Added manual lab: ${result.lab.testName} (${result.lab.status})`, 'success');
        await this.selectPatient(this.state.activePatient.id, true);
        this.setRecordTab('labs');
      } else {
        this.showToast("Failed to record manual lab", 'error');
      }
    } catch (e) {
      this.showToast("Network error saving manual lab", 'error');
    }
  }

  // --- Inconsistency Review and Dismissal (Prompt 2 MVP) ---
  openConflictReviewModal(conflictId) {
    const conflict = (this.state.inconsistencies || []).find(c => c.id === conflictId);
    if (!conflict) return;

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-scale-up">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold text-slate-900">${conflict.title}</h3>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full badge-conflict">Review</span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">${conflict.description}</p>
            </div>
            <button onclick="window.app.closeModal()" class="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div class="font-bold text-[10px] text-slate-500 uppercase">Record A</div>
              <div class="font-extrabold text-slate-900 text-sm mt-1">${conflict.recordA.value}</div>
              <div class="text-[11px] text-slate-500 mt-1">Source: ${conflict.recordA.source}</div>
              <div class="text-[10px] text-slate-400 font-mono">Date: ${conflict.recordA.date}</div>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div class="font-bold text-[10px] text-slate-500 uppercase">Record B</div>
              <div class="font-extrabold text-slate-900 text-sm mt-1">${conflict.recordB.value}</div>
              <div class="text-[11px] text-slate-500 mt-1">Source: ${conflict.recordB.source}</div>
              <div class="text-[10px] text-slate-400 font-mono">Date: ${conflict.recordB.date}</div>
            </div>
          </div>

          <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
            <strong>Recommended Clinical Action:</strong> ${conflict.recommendedAction}
          </div>

          <div class="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button 
              onclick="window.app.openDismissConflictModal('${conflict.id}')"
              class="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition"
            >
              Dismiss Discrepancy
            </button>
            <button 
              onclick="window.app.closeModal()"
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
            >
              Keep for Human Review
            </button>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  openDismissConflictModal(conflictId) {
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-scale-up">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 class="text-base font-bold text-slate-900">Dismiss Inconsistency</h3>
              <p class="text-xs text-slate-500 mt-0.5">Clinical justification is required for the audit trail.</p>
            </div>
            <button onclick="window.app.closeModal()" class="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form onsubmit="window.app.confirmDismissConflict(event, '${conflictId}')" class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Reason for Dismissal</label>
              <textarea name="reason" rows="3" required placeholder="e.g. Verified with patient: Telmisartan 40mg discontinued; Amlodipine 5mg confirmed active." class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500"></textarea>
            </div>

            <div class="pt-2 flex items-center justify-end gap-2">
              <button type="button" onclick="window.app.closeModal()" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold">
                Cancel
              </button>
              <button type="submit" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-sm transition">
                Confirm Dismissal
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  async confirmDismissConflict(e, conflictId) {
    e.preventDefault();
    const form = e.target;
    const reason = form.reason.value;

    try {
      const res = await fetch(`/api/inconsistencies/${conflictId}/dismiss`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dismissedBy: this.state.currentUser ? this.state.currentUser.name : "Dr. Emily Vance",
          reason: reason
        })
      });
      if (res.ok) {
        this.closeModal();
        this.showToast("Inconsistency dismissed and logged to audit trail", 'success');
        await this.selectPatient(this.state.activePatient.id, true);
        this.setRecordTab('conflicts');
      } else {
        this.showToast("Failed to dismiss conflict", 'error');
      }
    } catch (e) {
      this.showToast("Network error dismissing conflict", 'error');
    }
  }

  // --- Lab Verification & Edit Modal ---
  async verifyLabItem(labId, status) {
    try {
      const res = await fetch(`/api/labs/${labId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: status,
          verifiedBy: this.state.currentUser ? this.state.currentUser.name : "Dr. Emily Vance"
        })
      });
      if (res.ok) {
        this.showToast(`Parameter certified as ${status}`, 'success');
        await this.selectPatient(this.state.activePatient.id, true);
      }
    } catch (e) {
      this.showToast("Failed to verify item", 'error');
    }
  }

  async verifyAllReportLabs(reportId) {
    const reportLabs = (this.state.labs || []).filter(l => l.reportId === reportId);
    for (const l of reportLabs) {
      await fetch(`/api/labs/${l.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Verified',
          verifiedBy: this.state.currentUser ? this.state.currentUser.name : "Dr. Emily Vance"
        })
      });
    }
    this.showToast(`Verified all ${reportLabs.length} parameters into permanent record`, 'success');
    await this.selectPatient(this.state.activePatient.id, true);
  }

  openEditLabModal(labId) {
    const lab = (this.state.labs || []).find(l => l.id === labId);
    if (!lab) return;

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-scale-up">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 class="text-base font-bold text-slate-900">Edit Extracted Parameter</h3>
              <p class="text-xs text-slate-500 mt-0.5">Mandatory reason required for clinical traceability.</p>
            </div>
            <button onclick="window.app.closeModal()" class="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form onsubmit="window.app.saveEditLab(event, '${lab.id}')" class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Test Name</label>
              <input type="text" name="testName" value="${lab.testName}" required class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Value</label>
                <input type="text" name="value" value="${lab.value}" required class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Unit</label>
                <input type="text" name="unit" value="${lab.unit || ''}" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500" />
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Reference Range</label>
              <input type="text" name="referenceRange" value="${lab.referenceRange || 'Not provided'}" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Reason for Correction (Audit Trail)</label>
              <input type="text" name="reason" required placeholder="e.g. Corrected OCR transcription from handwritten scan" class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-500" />
            </div>

            <div class="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button type="button" onclick="window.app.closeModal()" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-sm transition">
                Save & Certify Edit
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  async saveEditLab(e, labId) {
    e.preventDefault();
    const form = e.target;

    try {
      const res = await fetch(`/api/labs/${labId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Edited',
          verifiedBy: this.state.currentUser ? this.state.currentUser.name : "Dr. Emily Vance",
          notes: form.reason.value,
          updatedFields: {
            testName: form.testName.value,
            value: form.value.value,
            unit: form.unit.value,
            referenceRange: form.referenceRange.value
          }
        })
      });
      if (res.ok) {
        this.closeModal();
        this.showToast("Lab parameter updated and recorded in audit log", 'success');
        await this.selectPatient(this.state.activePatient.id, true);
      }
    } catch (e) {
      this.showToast("Error updating lab item", 'error');
    }
  }

  // --- Provenance Drawer ---
  openProvenanceDrawer(labId) {
    const lab = (this.state.labs || []).find(l => l.id === labId);
    if (!lab) return;

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    const conf = lab.confidence ? Math.round(lab.confidence * 100) : 95;

    modalRoot.innerHTML = `
      <div class="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-2xs animate-fade-in" onclick="if(event.target === this) window.app.closeModal()">
        <div class="bg-white w-full max-w-md h-full shadow-2xl p-6 space-y-5 overflow-y-auto animate-slide-left">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Data Provenance Record</span>
              <h3 class="text-lg font-bold text-slate-900">${lab.testName}</h3>
            </div>
            <button onclick="window.app.closeModal()" class="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <!-- Parameter Summary -->
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Extracted Value:</span>
              <span class="font-mono font-extrabold text-slate-900 text-sm">${lab.value} ${lab.unit}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Source Reference Range:</span>
              <span class="font-mono font-bold text-slate-700">${lab.referenceRange || 'Not provided'}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Evaluated Status:</span>
              <span class="font-bold ${lab.status === 'High' ? 'text-rose-600' : lab.status === 'Low' ? 'text-amber-600' : 'text-emerald-600'}">
                ${lab.status}
              </span>
            </div>
          </div>

          <!-- Strict Rule Explanation -->
          <div class="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs space-y-1">
            <div class="font-bold text-teal-900 flex items-center gap-1.5">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-teal-700"></i> Strict Evaluation Rule
            </div>
            <p class="text-teal-800 text-[11px] leading-relaxed">
              ${lab.referenceRange === 'Not provided' 
                ? 'Source report did not provide a reference interval. MediVault AI strictly marks the status as "Cannot determine". Inventing or guessing medical intervals is prohibited.'
                : `Source report provided reference interval (${lab.referenceRange}). Value evaluated mathematically against source bounds without guessing.`}
            </p>
          </div>

          <!-- Source Document Trace -->
          <div class="space-y-2 text-xs">
            <span class="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Source Document Trace</span>
            <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="text-slate-500">File:</span>
                <span class="font-bold text-slate-800">${lab.sourceDoc || 'Report.pdf'}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Report ID:</span>
                <span class="font-mono text-slate-600">${lab.reportId}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Test Date:</span>
                <span class="font-mono text-slate-600">${lab.testDate}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">OCR Confidence:</span>
                <span class="font-bold ${conf < 70 ? 'text-amber-600' : 'text-emerald-600'}">${conf}%</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-slate-200 space-y-2">
            <button 
              onclick="window.app.openDocumentVerification('${lab.reportId}'); window.app.closeModal();"
              class="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <i data-lucide="split-square-vertical" class="w-4 h-4"></i> View in Split-Screen Review
            </button>
            <button 
              onclick="window.app.openEditLabModal('${lab.id}');"
              class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              Edit Parameter Value
            </button>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // --- Report Pipeline Presets (Prompt 2 MVP) ---
  async triggerSamplePipeline(presetKey) {
    if (presetKey === 'unreadable_scan') {
      // Simulate unreadable document error banner + Review Manually button
      this.state.uploadProgress = { isProcessing: true, step: 1, message: "Uploading degraded document scan..." };
      this.render();
      await this.sleep(400);

      this.state.uploadProgress = { isProcessing: true, step: 2, message: "Running OCR engine on degraded image..." };
      this.render();
      await this.sleep(600);

      // Halt at Step 2 with error banner
      this.state.uploadProgress = { 
        isProcessing: false, 
        step: 2, 
        error: true, 
        errorMessage: "Unable to confidently read this report. Image resolution is degraded or handwriting confidence is below clinical safety threshold (48%). Please use manual entry."
      };
      this.showToast("Extraction halted: unreadable scan", "warning");
      this.render();
      return;
    }

    let targetPatientId = 'P-10491';
    let targetReportId = 'REP-9012';
    let nextView = 'verification';

    if (presetKey === 'ananya_antenatal') {
      targetPatientId = 'P-10490';
      targetReportId = 'REP-9010';
    } else if (presetKey === 'rahul_lipid') {
      targetPatientId = 'P-10491';
      targetReportId = 'REP-9012';
    } else if (presetKey === 'rahul_discharge') {
      targetPatientId = 'P-10491';
      targetReportId = 'REP-9013';
      nextView = 'conflicts';
    } else if (presetKey === 'rahul_cardio') {
      targetPatientId = 'P-10491';
      targetReportId = 'REP-9015';
    }

    // Step 1: Upload
    this.state.uploadProgress = { isProcessing: true, step: 1, message: "Uploading clinical document to secure vault..." };
    this.render();
    await this.sleep(400);

    // Step 2: OCR
    this.state.uploadProgress = { isProcessing: true, step: 2, message: "Running OCR engine on document layout..." };
    this.render();
    await this.sleep(500);

    // Step 3: Entity Extraction
    this.state.uploadProgress = { isProcessing: true, step: 3, message: "Extracting clinical entities and lab parameters..." };
    this.render();
    await this.sleep(500);

    // Step 4: Range Matching
    this.state.uploadProgress = { isProcessing: true, step: 4, message: "Applying strict reference range rules (zero hallucination)..." };
    this.render();
    await this.sleep(400);

    // Step 5: Verification Ready
    this.state.uploadProgress = { isProcessing: false, step: 5, message: "Pipeline complete! Extracted parameters ready for verification." };
    
    await this.selectPatient(targetPatientId, false);
    this.state.selectedVerificationReportId = targetReportId;

    this.showToast("Pipeline complete! Reviewing extracted clinical data.", "success");
    if (nextView === 'conflicts') {
      this.setRecordTab('conflicts');
      this.navigateTo('patient-record');
    } else {
      this.navigateTo('verification');
    }
  }

  handleFileSelect(files) {
    if (!files || files.length === 0) return;
    this.showToast(`Processing ${files[0].name}...`, 'info');
    this.triggerSamplePipeline('rahul_lipid');
  }

  handleFileDrop(event) {
    const files = event.dataTransfer ? event.dataTransfer.files : null;
    this.handleFileSelect(files);
  }

  openDocumentVerification(reportId) {
    this.state.selectedVerificationReportId = reportId;
    this.navigateTo('verification');
  }

  // --- Table Filters & Sort ---
  setLabSearch(q) {
    this.state.labSearchQuery = q;
    this.render();
  }

  setLabStatusFilter(status) {
    this.state.labStatusFilter = status;
    this.render();
  }

  setLabVerificationFilter(status) {
    this.state.labVerificationFilter = status;
    this.render();
  }

  toggleLabSort(field) {
    if (this.state.labSortField === field) {
      this.state.labSortAsc = !this.state.labSortAsc;
    } else {
      this.state.labSortField = field;
      this.state.labSortAsc = true;
    }
    this.render();
  }

  closeModal() {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) modalRoot.innerHTML = '';
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-emerald-600 text-white' :
                    type === 'error' ? 'bg-rose-600 text-white' :
                    type === 'warning' ? 'bg-amber-600 text-white' :
                    'bg-slate-900 text-white';

    toast.className = `p-3.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 pointer-events-auto animate-scale-up ${bgClass}`;
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-triangle' : 'info'}" class="w-4 h-4"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // --- Search Modal (Cmd+K) ---
  openSearchModal() {
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-slate-900/60 backdrop-blur-xs animate-fade-in" onclick="if(event.target === this) window.app.closeModal()">
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-4 space-y-3 animate-scale-up">
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 absolute left-3 top-3 text-slate-400"></i>
            <input 
              type="text" 
              id="global-search-input"
              placeholder="Search patients, tests, medications, or reports..." 
              oninput="window.app.executeGlobalSearch(this.value)"
              class="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-teal-500 bg-slate-50"
              autofocus
            />
          </div>
          <div id="search-results-list" class="space-y-1.5 max-h-80 overflow-y-auto text-xs">
            <div class="p-3 text-slate-400 text-center italic">Type a search term above...</div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => {
      const inp = document.getElementById('global-search-input');
      if (inp) inp.focus();
    }, 50);
  }

  async executeGlobalSearch(q) {
    const list = document.getElementById('search-results-list');
    if (!list) return;

    if (!q || q.trim().length === 0) {
      list.innerHTML = '<div class="p-3 text-slate-400 text-center italic">Type a search term above...</div>';
      return;
    }

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const results = await res.json();
        if (results.length === 0) {
          list.innerHTML = '<div class="p-3 text-slate-400 text-center italic">No matching records found.</div>';
          return;
        }

        list.innerHTML = results.map(item => `
          <div 
            onclick="window.app.loadDemoPatient('${item.patientId}'); window.app.closeModal();"
            class="p-2.5 rounded-xl hover:bg-teal-50 cursor-pointer transition flex items-center justify-between border border-transparent hover:border-teal-200"
          >
            <div>
              <div class="font-bold text-slate-900">${item.title}</div>
              <div class="text-[11px] text-slate-500">${item.subtitle} • <span class="font-mono text-slate-400">${item.patientId}</span></div>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-bold">${item.category}</span>
          </div>
        `).join('');
      }
    } catch (e) {
      console.error(e);
    }
  }

  // --- Main App Render ---
  render() {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    if (this.state.currentView === 'landing') {
      appEl.innerHTML = window.LandingPageComponent.render(this.state);
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Dashboard & Portal Shell
    appEl.innerHTML = `
      <div class="flex-1 flex flex-col min-h-screen">
        ${window.NavbarComponent.render(this.state)}

        <div class="flex-1 flex overflow-hidden">
          ${window.SidebarComponent.render(this.state)}

          <main class="flex-1 overflow-y-auto bg-slate-50/50 pb-16">
            ${
              this.state.currentView === 'dashboard' ? window.DashboardComponent.render(this.state) :
              this.state.currentView === 'patient-record' ? window.PatientRecordComponent.render(this.state, this.state.recordTab) :
              this.state.currentView === 'add-patient' ? window.PatientFormComponent.render(this.state) :
              this.state.currentView === 'upload' ? window.ReportUploadComponent.render(this.state) :
              this.state.currentView === 'verification' ? window.SplitVerificationComponent.render(this.state) :
              this.state.currentView === 'lab-results' ? window.LabResultsTableComponent.render(this.state) :
              this.state.currentView === 'trends' ? window.TrendChartsComponent.render(this.state) :
              this.state.currentView === 'compare' ? window.ReportCompareComponent.render(this.state) :
              this.state.currentView === 'ai-summary' ? window.AISummaryViewComponent.render(this.state) :
              this.state.currentView === 'inconsistencies' ? window.InconsistenciesComponent.render(this.state) :
              this.state.currentView === 'clarifications' ? window.ClarificationsComponent.render(this.state) :
              this.state.currentView === 'audit' ? window.AuditHistoryComponent.render(this.state) :
              this.state.currentView === 'settings' ? window.SettingsPrivacyComponent.render(this.state) :
              window.DashboardComponent.render(this.state)
            }
          </main>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }
}

// Bootstrap Application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new MediVaultApp();
  app.init();
});
