import { SEC_DEFS, FW, DEFAULT_SNIPS } from './data.js';

// ════════════════════════════════════════════════
//  STATE
// ════════════════════════════════════════════════

export const ST = {
  fw: 'custom',
  mode: 'write',
  vals: {},
  on: {},
  snips: {},
  techFilter: 'all'
};

// Initialise val/on for every base section
Object.keys(SEC_DEFS).forEach(id => {
  ST.vals[id] = '';
  ST.on[id] = true;
});

const STORAGE_KEY = 'pp4';

export function loadST() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (d.vals)  Object.assign(ST.vals, d.vals);
    if (d.on)    Object.assign(ST.on, d.on);
    if (d.fw)    ST.fw = d.fw;
    if (d.snips) ST.snips = d.snips;
  } catch (_) {}
}

export function saveST() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    vals: ST.vals,
    on:   ST.on,
    fw:   ST.fw,
    snips: ST.snips
  }));
}

// ════════════════════════════════════════════════
//  SECTION HELPERS
// ════════════════════════════════════════════════

export function currentFW() {
  return FW[ST.fw] || FW.custom;
}

/**
 * Returns the resolved section array for the active framework.
 * Each entry:
 *   { idx, baseId, secId, tag, title, wm, ph, tip }
 */
export function currentSections() {
  return currentFW().sections.map((s, idx) => {
    const base = SEC_DEFS[s.base];
    if (!base) {
      console.warn(`Unknown base section "${s.base}" in framework "${ST.fw}"`);
      return null;
    }
    const ov = s.overrides || {};
    const secId = ov.id || s.base;
    const title = ov.title || base.title;
    return {
      idx,
      baseId: s.base,
      secId,
      tag:   ov.tag   || base.tag,
      title,
      wm:    title.split('/')[0].trim().toUpperCase().substring(0, 10),
      ph:    ov.ph    || base.ph,
      tip:   base.tip
    };
  }).filter(Boolean);
}

export function getVal(sec) {
  const v = ST.vals[sec.secId];
  if (v !== undefined) return v;
  return ST.vals[sec.baseId] || '';
}

export function setVal(sec, v) {
  ST.vals[sec.secId] = v;
  ST.vals[sec.baseId] = v;
}

export function activeSecs() {
  return currentSections().filter(s => ST.on[s.secId] && getVal(s).trim());
}

export function assembleText() {
  return activeSecs()
    .map(s => `## ${s.title}\n\n${getVal(s)}`)
    .join('\n\n---\n\n');
}

export function completionStats() {
  const secs = currentSections();
  const filled = secs.filter(s => getVal(s).trim()).length;
  return { filled, total: secs.length, pct: secs.length ? Math.round((filled / secs.length) * 100) : 0 };
}

/** Returns all snippets (default + user-saved) for a section's baseId */
export function snipsFor(baseId, secId) {
  const def = DEFAULT_SNIPS[baseId] || [];
  const usr = ST.snips[secId] || ST.snips[baseId] || [];
  return [...def, ...usr];
}
