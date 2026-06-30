<script>
  import { appStore, completionStats, activeSections, currentSections, showToast } from '../store.js';
  import { FRAMEWORKS } from '../data/frameworks.js';
  import { SECTION_DEFINITIONS } from '../data/sections.js';
  import { assemblePromptText, exportPromptAsMarkdown, buildShareURL, parseMarkdownExport } from '../lib/promptUtils.js';

  export let isHeaderHidden = false;

  let isOverflowMenuOpen = false;
  let fileInputElement;

  // Close overflow menu when clicking outside
  function handleDocumentClick(event) {
    if (!event.target.closest('.overflow-menu-container')) {
      isOverflowMenuOpen = false;
    }
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('pp-theme', theme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme || 'dark';
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  $: currentTheme = typeof document !== 'undefined' ? document.documentElement.dataset.theme : 'dark';

  function copyFullPrompt() {
    const assembledText = assemblePromptText($activeSections, $appStore.sectionValues);
    if (!assembledText.trim()) { showToast('Nothing to copy yet', true); return; }
    navigator.clipboard.writeText(assembledText).then(() => showToast('Prompt copied! ✓'));
  }

  function handleShareURL() {
    const shareURL = buildShareURL($appStore);
    navigator.clipboard.writeText(shareURL).then(() => showToast('Share link copied!'));
    isOverflowMenuOpen = false;
  }

  function handleExport() {
    const framework = FRAMEWORKS[$appStore.activeFramework] ?? FRAMEWORKS.custom;
    if (!$activeSections.length) { showToast('Nothing to export', true); return; }
    exportPromptAsMarkdown(framework.name, $activeSections, $appStore.sectionValues);
    showToast('Exported as prompt.md');
    isOverflowMenuOpen = false;
  }

  function handleLoad() {
    fileInputElement.click();
    isOverflowMenuOpen = false;
  }

  function handleFileLoad(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const parsedValues = parseMarkdownExport(loadEvent.target.result, SECTION_DEFINITIONS);
      Object.entries(parsedValues).forEach(([sectionId, value]) => {
        appStore.setSectionValue(sectionId, value);
      });
      showToast('Loaded from file');
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  function handleClear() {
    if (!confirm('Clear all section content? This cannot be undone.')) return;
    appStore.clearAllSections();
    showToast('All sections cleared');
    isOverflowMenuOpen = false;
  }
</script>

<svelte:document on:click={handleDocumentClick} />

<!-- Hidden file input for Load -->
<input type="file" bind:this={fileInputElement} accept=".md,.txt" style="display:none" on:change={handleFileLoad}>

<header class="app-header" class:is-hidden={isHeaderHidden}>

  <!-- Mobile hamburger -->
  <button class="mobile-menu-button button is-icon-only" on:click={appStore.openMobileSidebar} aria-label="Open menu">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  </button>

  <!-- Logo -->
  <a class="header-logo" href="#" on:click|preventDefault>
    <div class="header-logo-icon">
      <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    </div>
    PromptPad
  </a>

  <!-- Framework selector -->
  <div class="header-framework-wrap">
    <span class="header-framework-label">Framework</span>
    <select
      class="header-framework-select"
      value={$appStore.activeFramework}
      on:change={(e) => {
        appStore.setActiveFramework(e.target.value);
        showToast(`Switched to ${FRAMEWORKS[e.target.value].name} — your content is preserved`);
      }}
    >
      {#each Object.entries(FRAMEWORKS) as [frameworkKey, framework]}
        <option value={frameworkKey}>{framework.name}</option>
      {/each}
    </select>
  </div>

  <!-- Mode tabs -->
  <div class="header-tabs">
    {#each ['write', 'preview', 'assemble', 'guide'] as tabMode}
      <button
        class="header-tab-button"
        class:is-active={$appStore.currentMode === tabMode}
        on:click={() => appStore.setMode(tabMode)}
      >
        {tabMode.charAt(0).toUpperCase() + tabMode.slice(1)}
      </button>
    {/each}
  </div>

  <div class="header-spacer"></div>

  <!-- Progress -->
  <div class="header-progress" title="{$completionStats.filled} of {$completionStats.total} sections filled">
    <div class="progress-track">
      <div class="progress-fill" style="width:{$completionStats.percentage}%"></div>
    </div>
    <span class="progress-label">{$completionStats.filled}/{$completionStats.total}</span>
  </div>

  <div class="header-actions">

    <!-- Theme toggle -->
    <button class="button is-icon-only" on:click={toggleTheme} title="Toggle light/dark theme">
      {#if (document.documentElement.dataset.theme || 'dark') === 'dark'}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      {/if}
    </button>

    <!-- ⋯ Overflow: Share, Load, Export, Clear, Notes -->
    <div class="overflow-menu-container">
      <button class="button is-icon-only" on:click|stopPropagation={() => isOverflowMenuOpen = !isOverflowMenuOpen} title="More options">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
        </svg>
      </button>

      {#if isOverflowMenuOpen}
        <div class="overflow-dropdown">
          <button class="overflow-dropdown-item" on:click={handleShareURL}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Share
          </button>
          <button class="overflow-dropdown-item" on:click={handleLoad}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Load
          </button>
          <button class="overflow-dropdown-item" on:click={handleExport}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
          <hr class="overflow-dropdown-divider">
          <a class="overflow-dropdown-item" href="notes.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Notes
          </a>
          <hr class="overflow-dropdown-divider">
          <button class="overflow-dropdown-item" on:click={handleClear} style="color: var(--color-accent-error)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
            Clear All
          </button>
        </div>
      {/if}
    </div>

    <!-- Primary action -->
    <button class="button is-primary" on:click={copyFullPrompt}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      Copy Prompt
    </button>
  </div>
</header>
