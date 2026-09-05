/**
 * Add Patient Intake Form Component
 * STRICT RULE: Every manually entered item is clearly marked: "Source: User Provided".
 * Do NOT automatically convert user-provided information into a diagnosis.
 */
window.PatientFormComponent = {
  render() {
    return `
      <div class="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Add New Patient Profile</h1>
            <p class="text-xs text-slate-500 mt-1">
              Enter intake details. Information entered here is marked strictly as <strong>Source: User Provided</strong> and is not a medical diagnosis.
            </p>
          </div>
          <button onclick="window.app.navigateTo('dashboard')" class="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 bg-white">
            Cancel
          </button>
        </div>

        <!-- Intake Form Card -->
        <form id="add-patient-form" onsubmit="window.app.handleCreatePatient(event)" class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-8">
          
          <!-- Basic Demographics -->
          <div>
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
              <i data-lucide="user" class="w-4 h-4 text-teal-600"></i> Basic Information
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input required type="text" name="fullName" placeholder="e.g. Eleanor Vance" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Date of Birth *</label>
                <input required type="date" name="dob" value="1988-06-15" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Sex *</label>
                <select name="sex" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input type="tel" name="phone" placeholder="+1 (555) 000-0000" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input type="email" name="email" placeholder="patient@example.com" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact</label>
                <input type="text" name="emergencyContact" placeholder="Name & Phone (e.g. Spouse)" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
              </div>
            </div>
          </div>

          <!-- Medical Information with Multi-Entry -->
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i data-lucide="clipboard-list" class="w-4 h-4 text-teal-600"></i> Medical Information
              </h2>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold badge-user-provided">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Source: User Provided
              </span>
            </div>

            <!-- Dynamic Sections -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <!-- Symptoms -->
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div class="flex items-center justify-between mb-2">
                  <label class="text-xs font-bold text-slate-800">Reported Symptoms</label>
                  <button type="button" onclick="window.app.addMultiFieldRow('symptoms-list')" class="text-[11px] font-bold text-teal-600 hover:text-teal-700">
                    + Add Symptom
                  </button>
                </div>
                <div id="symptoms-list" class="space-y-2">
                  <div class="flex items-center gap-2">
                    <input type="text" name="symptoms[]" placeholder="e.g. Mild headache in afternoons" class="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg" />
                  </div>
                </div>
              </div>

              <!-- Conditions -->
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div class="flex items-center justify-between mb-2">
                  <label class="text-xs font-bold text-slate-800">Existing Conditions</label>
                  <button type="button" onclick="window.app.addMultiFieldRow('conditions-list')" class="text-[11px] font-bold text-teal-600 hover:text-teal-700">
                    + Add Condition
                  </button>
                </div>
                <div id="conditions-list" class="space-y-2">
                  <div class="flex items-center gap-2">
                    <input type="text" name="conditions[]" placeholder="e.g. Mild Seasonal Asthma" class="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg" />
                  </div>
                </div>
              </div>

              <!-- Allergies -->
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div class="flex items-center justify-between mb-2">
                  <label class="text-xs font-bold text-slate-800">Allergies & Reactions</label>
                  <button type="button" onclick="window.app.addMultiFieldRow('allergies-list')" class="text-[11px] font-bold text-teal-600 hover:text-teal-700">
                    + Add Allergy
                  </button>
                </div>
                <div id="allergies-list" class="space-y-2">
                  <div class="flex items-center gap-2">
                    <input type="text" name="allergies[]" placeholder="e.g. Penicillin (Hives)" class="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg" />
                  </div>
                </div>
              </div>

              <!-- Current Medications -->
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div class="flex items-center justify-between mb-2">
                  <label class="text-xs font-bold text-slate-800">Current Medications</label>
                  <button type="button" onclick="window.app.addMultiFieldRow('meds-list')" class="text-[11px] font-bold text-teal-600 hover:text-teal-700">
                    + Add Medication
                  </button>
                </div>
                <div id="meds-list" class="space-y-2">
                  <div class="flex items-center gap-2">
                    <input type="text" name="medications[]" placeholder="e.g. Albuterol inhaler PRN" class="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Medical History & Family History -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Previous Medical History & Procedures</label>
                <textarea rows="3" name="medicalHistory" placeholder="Relevant surgical history, previous hospitalizations..." class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"></textarea>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Family Medical History</label>
                <textarea rows="3" name="familyHistory" placeholder="Familial cardiovascular, metabolic, or oncology history..." class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"></textarea>
              </div>
            </div>
          </div>

          <!-- Strict Provenance Disclaimer -->
          <div class="p-4 bg-teal-50/50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-start gap-3">
            <i data-lucide="shield-alert" class="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5"></i>
            <div>
              <strong>Data Provenance Policy:</strong> All information submitted via this intake form will be tagged with <strong>Source: User Provided</strong>. It will not be treated as a clinical diagnosis unless substantiated by verified medical documentation.
            </div>
          </div>

          <!-- Submit Action -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onclick="window.app.navigateTo('dashboard')" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900">
              Cancel
            </button>
            <button type="submit" class="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2">
              <i data-lucide="save" class="w-4 h-4"></i> Save Patient Profile
            </button>
          </div>
        </form>
      </div>
    `;
  }
};
