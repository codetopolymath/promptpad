import { SEC_COLORS, FW, TECHNIQUES } from './data.js';
import {
  ST, loadST, saveST,
  currentFW, currentSections,
  getVal, setVal,
  activeSecs, assembleText,
  completionStats, snipsFor
} from './store.js';

// ════════════════════════════════════════════════
//  UTILITIES
// ════════════════════════════════════════════════

function escH(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escAttr(s) {
  return String(s).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
}

let _toastTimer;
function toast(msg, type = 'ok') {
  const el = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  msgEl.textContent = msg;
  el.className = 'toast up' + (type === 'err' ? ' err' : '');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('up'), 2800);
}

// ════════════════════════════════════════════════
//  HEADER
// ════════════════════════════════════════════════

function buildHeader() {
  const fw = currentFW();
  const stats = completionStats();
  const fwOptions = Object.entries(FW)
    .map(([k, f]) => `<option value="${k}"${ST.fw === k ? ' selected' : ''}>${escH(f.name)}</option>`)
    .join('');

  document.getElementById('hdr').innerHTML = `
    <button class="mob-menu-btn" onclick="openMobileSb()" aria-label="Open menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
    <a class="logo" href="#" onclick="return false">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>
      PromptPad
      <span class="ver">v3</span>
    </a>
    <div class="fw-wrap">
      <span class="fw-lbl">Framework</span>
      <select class="fw-sel" id="fw-sel" onchange="changeFw(this.value)">${fwOptions}</select>
    </div>
    <div class="tabs">
      <button class="tab-btn${ST.mode === 'write'    ? ' on' : ''}" onclick="mode('write')">Write</button>
      <button class="tab-btn${ST.mode === 'preview'  ? ' on' : ''}" onclick="mode('preview')">Preview</button>
      <button class="tab-btn${ST.mode === 'assemble' ? ' on' : ''}" onclick="mode('assemble')">Assemble</button>
      <button class="tab-btn${ST.mode === 'guide'    ? ' on' : ''}" onclick="mode('guide')">Guide</button>
    </div>
    <div class="sp"></div>
    <div class="hdr-progress" title="${stats.filled} of ${stats.total} sections filled">
      <div class="progress-track"><div class="progress-fill" style="width:${stats.pct}%"></div></div>
      <span class="progress-label">${stats.filled}/${stats.total}</span>
    </div>
    <div class="hdr-acts">
      <button class="btn" onclick="shareURL()" title="Copy share link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        Share
      </button>
      <button class="btn" onclick="doLoad()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Load
      </button>
      <button class="btn" onclick="doExport()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Export
      </button>
      <button class="btn" onclick="doClear()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
        Clear
      </button>
      <button class="btn primary" onclick="copyFull()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        Copy Prompt
      </button>
    </div>
  `;
}

// ════════════════════════════════════════════════
//  SIDEBAR
// ════════════════════════════════════════════════

function buildSb() {
  const secs = currentSections();
  const stats = completionStats();
  const fw = currentFW();

  const navItems = secs.map(s => {
    const col = (SEC_COLORS[s.baseId] || SEC_COLORS.role).color;
    const filled = getVal(s).trim();
    return `
      <div class="ni${ST.on[s.secId] ? '' : ' off'}${filled ? ' filled' : ''}"
           id="nav-${s.idx}"
           onclick="scrollToCard(${s.idx})">
        <span class="ni-color-dot" style="background:${col}"></span>
        <span class="ni-num">${String(s.idx + 1).padStart(2, '0')}</span>
        <span>${s.title}</span>
        <span class="ni-dot"></span>
      </div>`;
  }).join('');

  const quickInject = TECHNIQUES.slice(0, 4).map(t => `
    <div class="inject-pill" onclick="injectTech('${escAttr(t.injectTo)}','${escAttr(t.snippet)}','${escAttr(t.name)}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
      ${escH(t.name)}
    </div>`).join('');

  document.getElementById('sb').innerHTML = `
    <div class="sb-head">
      <div class="sb-fw-name">${escH(fw.name)}</div>
      <div class="sb-progress">
        <div class="sb-progress-track">
          <div class="sb-progress-fill" style="width:${stats.pct}%"></div>
        </div>
        <span class="sb-progress-label">${stats.pct}% complete</span>
      </div>
    </div>
    <div class="sb-lbl">Sections</div>
    ${navItems}
    <div class="sb-div"></div>
    <div class="sb-section">
      <div class="sb-inject-title">Quick Inject</div>
      ${quickInject}
      <div class="inject-pill" onclick="mode('guide')" style="margin-top:4px;border-style:dashed">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        All Techniques →
      </div>
    </div>
    <div class="sb-foot">
      <div class="sb-hint">
        Click <strong style="color:var(--acc3)">ⓘ</strong> to learn each section.
        Click <strong style="color:var(--acc)">📚</strong> for snippet starters.
      </div>
      <div style="display:flex;align-items:center;gap:4px;margin-top:8px">
        <span class="kbd">⌘</span><span class="kbd">↵</span>
        <span style="font-size:11px;color:var(--dim);margin-left:2px">copy prompt</span>
      </div>
    </div>
  `;
}

// ════════════════════════════════════════════════
//  FRAMEWORK BANNER
// ════════════════════════════════════════════════

function buildFwBanner() {
  const fw = currentFW();
  const el = document.getElementById('fw-banner');
  if (!el) return;
  if (ST.fw === 'custom') { el.innerHTML = ''; return; }

  const letters = fw.letters.map(l =>
    `<span class="fw-letter" style="color:${l.c};border:1px solid ${l.c}22;background:${l.c}11">${escH(l.l)}</span>`
  ).join('');

  el.innerHTML = `
    <div class="fw-banner">
      <div class="fw-banner-icon">${fw.icon}</div>
      <div>
        <div class="fw-banner-name">${escH(fw.name)}</div>
        <div class="fw-banner-desc">${escH(fw.desc)}</div>
        <div class="fw-banner-letters">${letters}</div>
      </div>
    </div>`;
}

// ════════════════════════════════════════════════
//  SECTION CARDS
// ════════════════════════════════════════════════

function buildCards() {
  const secs = currentSections();
  const cardsEl = document.getElementById('cards');
  if (!cardsEl) return;

  cardsEl.innerHTML = secs.map(s => cardHTML(s)).join('');

  // Restore textarea heights after render
  secs.forEach(s => {
    const ta = document.getElementById(`ta-${s.idx}`);
    if (ta && ta.value) {
      ta.style.height = 'auto';
      ta.style.height = Math.max(100, ta.scrollHeight) + 'px';
    }
  });
}

function cardHTML(s) {
  const val = getVal(s);
  const col = SEC_COLORS[s.baseId] || SEC_COLORS.role;
  const snips = snipsFor(s.baseId, s.secId);
  const snipItems = snips.map((txt, si) => `
    <div class="snip-item" onclick="useSnip(${s.idx},${si})">
      <div class="snip-text">${escH(txt)}</div>
      <div class="snip-use">Use</div>
    </div>`).join('');

  return `
  <div class="sc${ST.on[s.secId] ? '' : ' off'}" id="card-${s.idx}">
    <div class="sc-stripe" style="background:${col.color}"></div>
    <div class="sc-hdr">
      <span class="sc-num">${String(s.idx + 1).padStart(2, '0')}</span>
      <span class="sc-tag" style="color:${col.color};background:${col.bg}">${escH(s.tag)}</span>
      <span class="sc-ttl">${escH(s.title)}</span>
      <div class="sc-acts">
        <button class="ic info" title="Learn about this section" onclick="flipTip(${s.idx})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </button>
        <button class="ic snip" title="Snippets" onclick="toggleSnip(event,${s.idx})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
        </button>
        <button class="ic cp" title="Copy section" onclick="copySec(${s.idx})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
        </button>
        <button class="tgl${ST.on[s.secId] ? ' on' : ''}" id="tgl-${s.idx}"
                onclick="flipOn(${s.idx},'${escAttr(s.secId)}')" title="Toggle section">
          <div class="tgl-th"></div>
        </button>
        <!-- Snippet dropdown -->
        <div class="snip-drop" id="sd-${s.idx}">
          <div class="snip-hdr-row">
            <span class="snip-title">Snippets — ${escH(s.title)}</span>
            <span style="font-size:11px;color:var(--dim)">${snips.length} saved</span>
          </div>
          ${snipItems || '<p style="font-size:12px;color:var(--dim);padding:4px 0">No snippets yet.</p>'}
          <button class="snip-save" onclick="saveSnip(${s.idx},'${escAttr(s.secId)}','${escAttr(s.baseId)}')">+ Save current text as snippet</button>
        </div>
      </div>
    </div>
    <div class="ew">
      <div class="wm${val ? ' gone' : ''}" id="wm-${s.idx}">${escH(s.wm)}</div>
      <textarea class="ta" id="ta-${s.idx}"
        placeholder="${escAttr(s.ph)}"
        rows="5"
        data-idx="${s.idx}"
        data-secid="${escAttr(s.secId)}"
        data-baseid="${escAttr(s.baseId)}"
        oninput="onInp(${s.idx},this)"
        onfocus="onFoc(${s.idx})"
        onblur="onBlr(${s.idx})"
      >${escH(val)}</textarea>
    </div>
    <div class="cc" id="cc-${s.idx}">${val.length} chars</div>
    <div class="tip-panel" id="tip-${s.idx}">
      <div class="tip-h what">📌 What is this?</div>
      <p>${escH(s.tip.what)}</p>
      <div class="tip-h why" style="margin-top:10px">🧠 Why it matters</div>
      <p>${escH(s.tip.why)}</p>
      <div class="tip-h ex" style="margin-top:10px">✍️ Example</div>
      <div class="tip-ex">${escH(s.tip.ex)}</div>
    </div>
  </div>`;
}

// ════════════════════════════════════════════════
//  GUIDE PANEL
// ════════════════════════════════════════════════

function buildGuide() {
  const fwCards = Object.entries(FW).map(([k, fw]) => `
    <div class="fw-card${ST.fw === k ? ' active' : ''}" onclick="changeFw('${k}');mode('write')">
      <div class="fw-card-icon">${fw.icon}</div>
      <div class="fw-card-name">${escH(fw.name)}</div>
      <div class="fw-card-count">${fw.sections.length} sections</div>
      <div class="fw-card-when">${escH(fw.when)}</div>
      <div class="fw-letters">
        ${fw.letters.map(l => `<span class="fw-l" style="color:${l.c};border-color:${l.c}33;background:${l.c}11">${escH(l.l)}</span>`).join('')}
      </div>
    </div>`).join('');

  const decRows = [
    ['Quick, well-defined task', 'RTF or TAG', 'Lean structure; model fills in sensible defaults'],
    ['Complex, multi-step task', 'RISEN or Custom', 'Need full instructions + explicit end goal'],
    ['Writing for a specific audience', 'CO-STAR', 'Audience field forces you to define the reader'],
    ['Exploratory / iterative task', 'CRISPE', 'Experiment field prompts self-evaluation'],
    ['Purpose-first / intent-driven', 'APE', 'Forces you to articulate why before what'],
    ['Reasoning or math', 'CoT + Custom', 'Add "think step by step" to Instructions'],
    ['You have good examples', 'Few-Shot (Custom)', 'Fill the Examples section; this alone beats instructions'],
    ['Model keeps making same mistake', 'Constraints + CoT', 'Add explicit Constraints + reasoning instruction'],
    ['High-stakes factual answer', 'Self-Consistency', 'Run 3×; take majority answer'],
    ['Multi-tool or agentic workflow', 'ReAct', 'Use Thought/Action/Observation loop in Instructions'],
    ['Complex task, breakable', 'Prompt Chaining', 'Split into sequential prompts; outputs chain'],
    ['Requires current/proprietary data', 'RAG', 'Paste retrieved docs into Context section'],
    ['Math/data manipulation', 'PAL', 'Ask for Python code solution in Instructions'],
    ['Need multiple options evaluated', 'Tree of Thoughts', 'Three-expert prompt in Instructions'],
    ['Uncertainty/hallucination risk', 'Generated Knowledge', 'Two-step: generate facts, then answer'],
    ['Long-context agentic systems', 'Context Engineering', 'Design what goes in context window and in what order'],
  ];

  const decTable = `
    <table class="dec-table">
      <thead><tr><th>Situation</th><th>Best Approach</th><th>Why</th></tr></thead>
      <tbody>${decRows.map(([cond, approach, why]) => `
        <tr>
          <td>${escH(cond)}</td>
          <td><span style="color:var(--acc);font-weight:600">${escH(approach)}</span></td>
          <td style="color:var(--sub)">${escH(why)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  const catColors = {
    reason: 'cat-reason', retrieve: 'cat-retrieve',
    agentic: 'cat-agentic', optim: 'cat-optim', context: 'cat-context'
  };

  const filterChips = [
    ['all', 'All'],
    ['reason', 'Reasoning'],
    ['retrieve', 'Retrieval'],
    ['agentic', 'Agentic'],
    ['context', 'Context']
  ].map(([val, label]) =>
    `<button class="filter-chip${ST.techFilter === val ? ' on' : ''}" onclick="filterTech('${val}')">${escH(label)}</button>`
  ).join('');

  const techCards = TECHNIQUES.map(t => `
    <div class="tech-card${ST.techFilter !== 'all' && t.cat !== ST.techFilter ? ' hidden' : ''}" data-cat="${t.cat}">
      <div class="tech-top">
        <div style="flex:1"><div class="tech-name">${escH(t.name)}</div></div>
        <span class="tech-cat ${catColors[t.cat] || 'cat-reason'}">${escH(t.catLabel)}</span>
      </div>
      <div class="tech-desc">${escH(t.desc)}</div>
      <div class="tech-when">
        <div class="tech-when-label">Use when:</div>
        ${t.when.map(w => `<span class="tech-tag">${escH(w)}</span>`).join('')}
      </div>
      <div class="tech-snippet">${escH(t.snippet)}</div>
      <div class="tech-actions">
        <button class="tech-btn" onclick="copyText('${escAttr(t.snippet)}','${escAttr(t.name)} snippet copied!')">Copy snippet</button>
        <button class="tech-btn inject" onclick="injectTech('${escAttr(t.injectTo)}','${escAttr(t.snippet)}','${escAttr(t.name)}')">→ Inject into prompt</button>
      </div>
    </div>`).join('');

  document.getElementById('p-guide').innerHTML = `
    <div class="g-title">Choose a Framework</div>
    <div class="g-desc">Click any card to switch. All your written content is preserved when switching.</div>
    <div class="fw-grid">${fwCards}</div>

    <div class="g-title">When to Use What</div>
    <div class="g-desc">Match your situation to the right approach. Frameworks and techniques stack.</div>
    <div class="dec-wrap">${decTable}</div>

    <div class="g-title">Advanced Techniques</div>
    <div class="g-desc">Techniques change how the model reasons — not just what information you give it.</div>
    <div class="tech-filter">${filterChips}</div>
    <div class="tech-grid" id="tech-grid">${techCards}</div>
  `;
}

// ════════════════════════════════════════════════
//  PREVIEW & ASSEMBLE
// ════════════════════════════════════════════════

function renderPreview() {
  const secs = activeSecs();
  const el = document.getElementById('p-preview');
  if (!secs.length) {
    el.innerHTML = `
      <div class="pv-card">
        <p style="color:var(--sub);font-style:italic;font-size:13px">
          Nothing written yet — switch to Write and fill in some sections.
        </p>
      </div>`;
    return;
  }
  const fw = currentFW();
  el.innerHTML = `
    <div class="pv-card">
      <div class="pv-hdr">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
        </svg>
        Preview — ${escH(fw.name)}
      </div>
      ${secs.map((s, i) => {
        const col = (SEC_COLORS[s.baseId] || SEC_COLORS.role).color;
        return `
          <div class="pv-sec">
            <div class="pv-lbl" style="color:${col}">
              <span class="pv-lbl-dot" style="background:${col}"></span>
              ${escH(s.tag)} — ${escH(s.title)}
            </div>
            <div class="pv-body">${marked.parse(getVal(s))}</div>
          </div>
          ${i < secs.length - 1 ? '<hr class="pv-div">' : ''}`;
      }).join('')}
    </div>`;
}

function renderAssemble() {
  const txt = assembleText();
  document.getElementById('as-out').textContent = txt || 'Nothing written yet.';
  const words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
  document.getElementById('as-w').textContent = words.toLocaleString();
  document.getElementById('as-c').textContent = txt.length.toLocaleString();
  document.getElementById('as-t').textContent = Math.round(txt.length / 4).toLocaleString();
}

// ════════════════════════════════════════════════
//  MODE SWITCHING
// ════════════════════════════════════════════════

function mode(m) {
  ST.mode = m;
  ['write', 'preview', 'assemble', 'guide'].forEach(x => {
    document.getElementById('p-' + x).classList.toggle('active', x === m);
  });
  // Update desktop tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('on', btn.textContent.toLowerCase() === m);
  });
  // Update mobile tabs
  document.querySelectorAll('.mob-tab').forEach(btn => {
    btn.classList.toggle('on', btn.dataset.mode === m);
  });
  if (m === 'preview')  renderPreview();
  if (m === 'assemble') renderAssemble();
  if (m === 'guide')    buildGuide();
  closeMobileSb();
}

// ════════════════════════════════════════════════
//  INPUT EVENTS
// ════════════════════════════════════════════════

function onInp(idx, el) {
  const secs = currentSections();
  const sec = secs[idx];
  if (!sec) return;

  setVal(sec, el.value);

  el.style.height = 'auto';
  el.style.height = Math.max(100, el.scrollHeight) + 'px';

  document.getElementById('wm-' + idx)?.classList.toggle('gone', !!el.value.trim());
  document.getElementById('cc-' + idx).textContent = el.value.length + ' chars';

  // Update sidebar filled state
  const navItem = document.getElementById('nav-' + idx);
  if (navItem) navItem.classList.toggle('filled', !!el.value.trim());

  // Update progress
  updateProgress();
  saveST();
}

function onFoc(idx) {
  document.getElementById('nav-' + idx)?.classList.add('lit');
}

function onBlr(idx) {
  document.getElementById('nav-' + idx)?.classList.remove('lit');
}

function updateProgress() {
  const stats = completionStats();
  const fill = document.querySelector('.progress-fill');
  const label = document.querySelector('.progress-label');
  const sbFill = document.querySelector('.sb-progress-fill');
  const sbLabel = document.querySelector('.sb-progress-label');
  if (fill)    fill.style.width = stats.pct + '%';
  if (label)   label.textContent = `${stats.filled}/${stats.total}`;
  if (sbFill)  sbFill.style.width = stats.pct + '%';
  if (sbLabel) sbLabel.textContent = `${stats.pct}% complete`;
}

// ════════════════════════════════════════════════
//  CARD ACTIONS
// ════════════════════════════════════════════════

function flipTip(idx) {
  document.getElementById('tip-' + idx)?.classList.toggle('show');
}

function flipOn(idx, secId) {
  ST.on[secId] = !ST.on[secId];
  document.getElementById('card-' + idx)?.classList.toggle('off', !ST.on[secId]);
  document.getElementById('tgl-' + idx)?.classList.toggle('on', ST.on[secId]);
  document.getElementById('nav-' + idx)?.classList.toggle('off', !ST.on[secId]);
  saveST();
}

function scrollToCard(idx) {
  document.getElementById('card-' + idx)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  closeMobileSb();
}

// ════════════════════════════════════════════════
//  SNIPPETS
// ════════════════════════════════════════════════

function toggleSnip(e, idx) {
  e.stopPropagation();
  const drop = document.getElementById('sd-' + idx);
  const isOpen = drop.classList.contains('open');

  // Close all other open dropdowns
  document.querySelectorAll('.snip-drop.open').forEach(d => d.classList.remove('open'));

  if (!isOpen) {
    drop.classList.add('open');
    // Viewport-aware: flip upward if too close to bottom
    const rect = drop.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.top;
    drop.classList.toggle('flip', spaceBelow < 280);
  }
}

document.addEventListener('click', () => {
  document.querySelectorAll('.snip-drop.open').forEach(d => d.classList.remove('open'));
});

function useSnip(idx, si) {
  const secs = currentSections();
  const sec = secs[idx];
  if (!sec) return;

  const snips = snipsFor(sec.baseId, sec.secId);
  const txt = snips[si];
  if (!txt) return;

  const ta = document.getElementById('ta-' + idx);
  if (ta) {
    ta.value = txt;
    onInp(idx, ta);
  }
  document.getElementById('sd-' + idx)?.classList.remove('open');
  toast('Snippet applied');
}

function saveSnip(idx, secId, baseId) {
  const ta = document.getElementById('ta-' + idx);
  const txt = ta?.value.trim();
  if (!txt) { toast('Section is empty — nothing to save', 'err'); return; }

  if (!ST.snips[secId]) ST.snips[secId] = [];
  if (ST.snips[secId].includes(txt)) { toast('Already saved'); return; }

  ST.snips[secId].push(txt);
  saveST();

  // Patch the dropdown in-place rather than full rebuild
  const drop = document.getElementById('sd-' + idx);
  if (drop) {
    const countEl = drop.querySelector('span[style]');
    const newCount = snipsFor(baseId, secId).length;
    if (countEl) countEl.textContent = newCount + ' saved';

    // Insert new snip item before the save button
    const saveBtn = drop.querySelector('.snip-save');
    const newItem = document.createElement('div');
    newItem.className = 'snip-item';
    newItem.onclick = () => useSnip(idx, newCount - 1);
    newItem.innerHTML = `<div class="snip-text">${escH(txt)}</div><div class="snip-use">Use</div>`;
    saveBtn.parentNode.insertBefore(newItem, saveBtn);
  }

  toast('Saved as snippet!');
}

// ════════════════════════════════════════════════
//  TECHNIQUE INJECT
// ════════════════════════════════════════════════

function injectTech(targetBaseId, snippet, name) {
  const secs = currentSections();
  const target = secs.find(s => s.baseId === targetBaseId) || secs[secs.length - 1];
  if (!target) return;

  const ta = document.getElementById('ta-' + target.idx);
  if (!ta) { toast('Switch to Write tab first', 'err'); return; }

  const decoded = snippet
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  const existing = ta.value.trim();
  ta.value = existing
    ? `${existing}\n\n[${name}]\n${decoded}`
    : `[${name}]\n${decoded}`;

  onInp(target.idx, ta);

  if (ST.mode !== 'write') mode('write');
  setTimeout(() => {
    ta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    ta.focus();
  }, 150);
  toast(`${name} injected into ${target.title}`);
}

function filterTech(cat) {
  ST.techFilter = cat;

  // Update filter chips
  document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.classList.toggle('on', btn.textContent.trim().toLowerCase() === cat ||
      (cat === 'all' && btn.textContent.trim() === 'All'));
  });

  // Show/hide tech cards
  document.querySelectorAll('.tech-card').forEach(card => {
    const cardCat = card.dataset.cat;
    card.classList.toggle('hidden', cat !== 'all' && cardCat !== cat);
  });
}

// ════════════════════════════════════════════════
//  FRAMEWORK SWITCH
// ════════════════════════════════════════════════

function changeFw(k) {
  ST.fw = k;
  const sel = document.getElementById('fw-sel');
  if (sel) sel.value = k;
  saveST();
  buildSb();
  buildFwBanner();
  buildCards();
  buildHeader();
  if (ST.mode === 'guide') buildGuide();
}

// ════════════════════════════════════════════════
//  CLIPBOARD & FILE ACTIONS
// ════════════════════════════════════════════════

function copySec(idx) {
  const secs = currentSections();
  const sec = secs[idx];
  if (!sec) return;
  const v = getVal(sec);
  if (!v.trim()) { toast('Section is empty', 'err'); return; }
  navigator.clipboard.writeText(v).then(() => {
    toast('Section copied!');
    const card = document.getElementById('card-' + idx);
    card?.classList.add('flashed');
    setTimeout(() => card?.classList.remove('flashed'), 500);
  });
}

function copyFull() {
  const txt = assembleText();
  if (!txt.trim()) { toast('Nothing to copy yet', 'err'); return; }
  navigator.clipboard.writeText(txt).then(() => toast('Prompt copied! ✓'));
}

function copyText(txt, msg) {
  const decoded = txt
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  navigator.clipboard.writeText(decoded).then(() => toast(msg || 'Copied!'));
}

function doClear() {
  if (!confirm('Clear all section content? This cannot be undone.')) return;
  const { ST: state } = { ST };
  Object.keys(ST.vals).forEach(k => ST.vals[k] = '');
  saveST();
  buildCards();
  updateProgress();
  buildSb();
  toast('All cleared');
}

function doExport() {
  const txt = assembleText();
  if (!txt.trim()) { toast('Nothing to export', 'err'); return; }
  const full = `# PromptPad Export — ${currentFW().name}\n\n${txt}`;
  const b = new Blob([full], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = 'prompt.md';
  a.click();
  toast('Exported as prompt.md');
}

function doLoad() {
  document.getElementById('file-inp').click();
}

document.getElementById('file-inp').addEventListener('change', function(e) {
  const f = e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const txt = ev.target.result;
    const parts = txt.split(/^##\s+/m).slice(1);
    parts.forEach(part => {
      const nl = part.indexOf('\n');
      const heading = part.slice(0, nl).trim();
      const body = part.slice(nl + 1).trim();
      // Map heading to section by title or tag (case-insensitive)
      const { SEC_DEFS: defs } = window._ppData || {};
      if (defs) {
        Object.values(defs).forEach(def => {
          if (def.title.toLowerCase() === heading.toLowerCase() ||
              def.tag.toLowerCase() === heading.toLowerCase()) {
            ST.vals[def.id] = body;
          }
        });
      }
    });
    saveST();
    buildCards();
    updateProgress();
    buildSb();
    toast('Loaded!');
  };
  reader.readAsText(f);
  this.value = '';
});

// ════════════════════════════════════════════════
//  URL SHARE
// ════════════════════════════════════════════════

function shareURL() {
  try {
    const state = { vals: ST.vals, on: ST.on, fw: ST.fw };
    const encoded = btoa(encodeURIComponent(JSON.stringify(state)));
    const url = `${location.origin}${location.pathname}#state=${encoded}`;
    navigator.clipboard.writeText(url).then(() => toast('Share link copied to clipboard!'));
  } catch (_) {
    toast('Could not generate share link', 'err');
  }
}

function loadFromHash() {
  const hash = location.hash;
  if (!hash.startsWith('#state=')) return;
  try {
    const encoded = hash.slice(7);
    const state = JSON.parse(decodeURIComponent(atob(encoded)));
    if (state.vals) Object.assign(ST.vals, state.vals);
    if (state.on)   Object.assign(ST.on,   state.on);
    if (state.fw)   ST.fw = state.fw;
    saveST();
    // Clear the hash so refresh doesn't reload shared state
    history.replaceState(null, '', location.pathname);
  } catch (_) {}
}

// ════════════════════════════════════════════════
//  MOBILE SIDEBAR
// ════════════════════════════════════════════════

function openMobileSb() {
  document.getElementById('sb').classList.add('open');
  document.getElementById('mob-overlay').classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeMobileSb() {
  document.getElementById('sb').classList.remove('open');
  document.getElementById('mob-overlay').classList.remove('visible');
  document.body.style.overflow = '';
}

// ════════════════════════════════════════════════
//  MOBILE BOTTOM TABS
// ════════════════════════════════════════════════

function buildMobTabs() {
  const tabs = [
    { mode: 'write',    label: 'Write',    icon: '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>' },
    { mode: 'preview',  label: 'Preview',  icon: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' },
    { mode: 'assemble', label: 'Assemble', icon: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>' },
    { mode: 'guide',    label: 'Guide',    icon: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
  ];

  const el = document.getElementById('mob-tabs');
  if (!el) return;
  el.innerHTML = tabs.map(t => `
    <button class="mob-tab${ST.mode === t.mode ? ' on' : ''}" data-mode="${t.mode}" onclick="mode('${t.mode}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${t.icon}</svg>
      ${t.label}
    </button>`).join('');
}

// ════════════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ════════════════════════════════════════════════

document.addEventListener('keydown', e => {
  const mod = e.metaKey || e.ctrlKey;
  if (mod && e.key === 'Enter') { e.preventDefault(); copyFull(); }
  if (mod && e.key === '1') { e.preventDefault(); mode('write'); }
  if (mod && e.key === '2') { e.preventDefault(); mode('preview'); }
  if (mod && e.key === '3') { e.preventDefault(); mode('assemble'); }
  if (mod && e.key === '4') { e.preventDefault(); mode('guide'); }
  if (e.key === 'Escape') {
    document.querySelectorAll('.snip-drop.open').forEach(d => d.classList.remove('open'));
    closeMobileSb();
  }
});

// ════════════════════════════════════════════════
//  EXPOSE GLOBALS  (for onclick= in innerHTML)
// ════════════════════════════════════════════════

Object.assign(window, {
  mode, changeFw, onInp, onFoc, onBlr,
  flipTip, flipOn, scrollToCard,
  toggleSnip, useSnip, saveSnip,
  injectTech, filterTech,
  copySec, copyFull, copyText,
  doClear, doExport, doLoad,
  shareURL, openMobileSb, closeMobileSb,
  toast
});

// ════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════

function init() {
  // Expose SEC_DEFS for file loader
  import('./data.js').then(m => { window._ppData = m; });

  loadST();
  loadFromHash();

  buildHeader();
  buildSb();
  buildFwBanner();
  buildCards();
  buildMobTabs();

  // Set initial panel visibility
  ['write', 'preview', 'assemble', 'guide'].forEach(x => {
    document.getElementById('p-' + x).classList.toggle('active', x === ST.mode);
  });

  if (ST.mode === 'preview')  renderPreview();
  if (ST.mode === 'assemble') renderAssemble();
  if (ST.mode === 'guide')    buildGuide();
}

init();
