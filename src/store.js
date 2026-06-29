import { writable, derived } from 'svelte/store';
import { SECTION_DEFINITIONS } from './data/sections.js';
import { FRAMEWORKS } from './data/frameworks.js';

const STORAGE_KEY = 'pp4';

// Migrate keys from the original app format (fw, vals, on, snips) to the new
// descriptive names so existing user data is not lost on upgrade.
function loadSavedState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      activeFramework:  raw.activeFramework  ?? raw.fw    ?? 'custom',
      sectionValues:    raw.sectionValues    ?? raw.vals  ?? {},
      enabledSections:  raw.enabledSections  ?? raw.on    ?? {},
      savedSnippets:    raw.savedSnippets    ?? raw.snips ?? {},
    };
  } catch {
    return {};
  }
}

function buildInitialState(saved) {
  const allSectionIds = Object.keys(SECTION_DEFINITIONS);
  return {
    activeFramework:    saved.activeFramework || 'custom',
    currentMode:        'write',
    sectionValues:      { ...Object.fromEntries(allSectionIds.map(id => [id, ''])), ...saved.sectionValues },
    enabledSections:    { ...Object.fromEntries(allSectionIds.map(id => [id, true])), ...saved.enabledSections },
    savedSnippets:      saved.savedSnippets || {},
    techniqueFilter:    'all',
    mobileSidebarOpen:  false,
  };
}

function createAppStore() {
  const { subscribe, update } = writable(buildInitialState(loadSavedState()));

  // Persist only the fields that should survive a page reload.
  subscribe(state => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      activeFramework: state.activeFramework,
      sectionValues:   state.sectionValues,
      enabledSections: state.enabledSections,
      savedSnippets:   state.savedSnippets,
    }));
  });

  return {
    subscribe,
    setMode:              (mode)         => update(s => ({ ...s, currentMode: mode })),
    setActiveFramework:   (framework)    => update(s => ({ ...s, activeFramework: framework })),
    setSectionValue:      (id, value)    => update(s => ({ ...s, sectionValues: { ...s.sectionValues, [id]: value } })),
    toggleSection:        (id)           => update(s => ({ ...s, enabledSections: { ...s.enabledSections, [id]: !(s.enabledSections[id] ?? true) } })),
    enableSection:        (id)           => update(s => ({ ...s, enabledSections: { ...s.enabledSections, [id]: true } })),
    saveSnippet:          (id, text)     => update(s => ({ ...s, savedSnippets: { ...s.savedSnippets, [id]: [...(s.savedSnippets[id] || []), text] } })),
    clearAllSections:     ()             => update(s => ({ ...s, sectionValues: Object.fromEntries(Object.keys(SECTION_DEFINITIONS).map(k => [k, ''])) })),
    setTechniqueFilter:   (category)     => update(s => ({ ...s, techniqueFilter: category })),
    openMobileSidebar:    ()             => update(s => ({ ...s, mobileSidebarOpen: true })),
    closeMobileSidebar:   ()             => update(s => ({ ...s, mobileSidebarOpen: false })),
    loadExternalState:    (partialState) => update(s => ({ ...s, ...partialState })),
  };
}

export const appStore = createAppStore();

// The definition of whichever framework is currently active.
export const activeFrameworkDefinition = derived(appStore, $store =>
  FRAMEWORKS[$store.activeFramework] ?? FRAMEWORKS.custom
);

// The ordered list of sections to display for the active framework,
// with any per-framework label/placeholder overrides applied.
export const currentSections = derived(appStore, $store => {
  const frameworkDefinition = FRAMEWORKS[$store.activeFramework] ?? FRAMEWORKS.custom;
  return frameworkDefinition.sections.map((sectionConfig, index) => {
    const baseDefinition = SECTION_DEFINITIONS[sectionConfig.baseSection];
    if (!baseDefinition) return null;
    const overrides = sectionConfig.overrides ?? {};
    return {
      index,
      id:          sectionConfig.baseSection,
      baseId:      sectionConfig.baseSection,
      shortLabel:  overrides.shortLabel  ?? baseDefinition.shortLabel,
      fullTitle:   overrides.fullTitle   ?? baseDefinition.fullTitle,
      placeholder: overrides.placeholder ?? baseDefinition.placeholder,
      tip:         baseDefinition.tip,
    };
  }).filter(Boolean);
});

// Sections that are enabled AND have content — used by Preview and Assemble.
export const activeSections = derived([appStore, currentSections], ([$store, $sections]) =>
  $sections.filter(section =>
    ($store.enabledSections[section.id] ?? true) &&
    $store.sectionValues[section.id]?.trim()
  )
);

// Prompt completion progress for the progress bar.
export const completionStats = derived([appStore, currentSections], ([$store, $sections]) => {
  const totalSections  = $sections.length;
  const filledSections = $sections.filter(s => $store.sectionValues[s.id]?.trim()).length;
  return {
    filled:     filledSections,
    total:      totalSections,
    percentage: totalSections ? Math.round(filledSections / totalSections * 100) : 0,
  };
});

// Toast notification state (separate from app state — not persisted).
export const toastState = writable({ message: '', visible: false, isError: false });

let toastDismissTimer;
export function showToast(message, isError = false) {
  clearTimeout(toastDismissTimer);
  toastState.set({ message, visible: true, isError });
  toastDismissTimer = setTimeout(() => toastState.update(t => ({ ...t, visible: false })), 2800);
}
