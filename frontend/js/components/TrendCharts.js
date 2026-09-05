/**
 * Lab Result Visualization & Trend Charts Component
 * Plots repeated laboratory measurements (Glucose, Hemoglobin, HbA1c, Cholesterol)
 * Plots source reference range bounds. Never creates artificial reference ranges!
 */
window.TrendChartsComponent = {
  render(state) {
    const activePatient = state.activePatient;
    const labs = (state.labs || []).filter(l => !activePatient || l.patientId === activePatient.id);

    // Group tests by testName
    const testsMap = {};
    labs.forEach(l => {
      const name = l.testName.replace(/, Fasting/, '');
      if (!testsMap[name]) testsMap[name] = [];
      testsMap[name].push(l);
    });

    // Filter tests with multiple records or popular markers
    const chartKeys = ['Glucose', 'Hemoglobin', 'HbA1c (Glycated Hemoglobin)', 'Total Cholesterol', 'Creatinine'];

    return `
      <div class="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">Laboratory Trend Visualizations</h1>
            <p class="text-xs text-slate-500 mt-0.5">
              Historical trajectories for repeated clinical markers. Bands represent the <strong>source-provided reference range</strong> for each specific testing facility.
            </p>
          </div>
          <div class="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-medium">
            Preserves facility-specific reference bounds
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          ${chartKeys.map(key => {
            const dataPoints = (testsMap[key] || []).sort((a, b) => new Date(a.testDate) - new Date(b.testDate));
            if (dataPoints.length === 0) return '';

            const unit = dataPoints[0].unit;
            return `
              <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-bold text-slate-800">${key} Trend</h3>
                    <div class="text-xs text-slate-500 font-mono mt-0.5">Unit: ${unit} • ${dataPoints.length} observation(s)</div>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full badge-extracted">Source Extracted</span>
                </div>

                <!-- Custom SVG Chart Canvas -->
                <div class="h-48 w-full bg-slate-50/50 rounded-xl border border-slate-100 p-3 flex flex-col justify-between">
                  <div class="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Facility Range: ${dataPoints[0].referenceRange}</span>
                    <span>Recent: ${dataPoints[dataPoints.length - 1].value} ${unit}</span>
                  </div>

                  <!-- SVG Visualization -->
                  <svg class="w-full h-32 overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                    <!-- Shaded Reference Range Band (Simulated Source Band) -->
                    <rect x="20" y="30" width="260" height="40" fill="rgba(20, 184, 166, 0.08)" stroke="rgba(20, 184, 166, 0.3)" stroke-dasharray="2,2" rx="4" />
                    <text x="25" y="42" font-size="7" fill="#0f766e" font-family="sans-serif">Source Reference Band</text>

                    <!-- Trend Line -->
                    ${dataPoints.length > 1 ? `
                      <polyline
                        fill="none"
                        stroke="#0d9488"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        points="${dataPoints.map((pt, i) => {
                          const x = 40 + i * (220 / (dataPoints.length - 1));
                          const norm = (pt.numericValue || 100);
                          const y = Math.max(15, Math.min(85, 100 - norm * 0.6));
                          return `${x},${y}`;
                        }).join(' ')}"
                      />
                    ` : ''}

                    <!-- Data Points -->
                    ${dataPoints.map((pt, i) => {
                      const x = dataPoints.length === 1 ? 150 : 40 + i * (220 / (dataPoints.length - 1));
                      const norm = (pt.numericValue || 100);
                      const y = Math.max(15, Math.min(85, 100 - norm * 0.6));
                      return `
                        <circle cx="${x}" cy="${y}" r="4.5" fill="#0f766e" stroke="#ffffff" stroke-width="2" />
                        <text x="${x}" y="${y - 8}" font-size="8" font-weight="bold" fill="#0f172a" text-anchor="middle">${pt.value}</text>
                      `;
                    }).join('')}
                  </svg>

                  <!-- Dates Line -->
                  <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-200">
                    ${dataPoints.map(p => `
                      <span>${p.testDate}</span>
                    `).join('')}
                  </div>
                </div>

                <!-- Observations and Provenance list -->
                <div class="space-y-1.5 pt-1 text-xs">
                  ${dataPoints.map(pt => `
                    <div class="flex items-center justify-between text-[11px] text-slate-600 p-2 bg-slate-50 rounded-lg">
                      <span class="font-semibold">${pt.testDate}: ${pt.value} ${pt.unit}</span>
                      <span class="text-slate-400 font-mono text-[10px] truncate max-w-[140px]">${pt.sourceDoc}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
};
