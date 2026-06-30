<script>
  import { onMount } from 'svelte';
  import { appStore, currentSections, completionStats, activeFrameworkDefinition, showToast } from '../store.js';
  import { SECTION_COLORS } from '../data/sections.js';
  import { TECHNIQUES } from '../data/techniques.js';

  const SIDEBAR_PIN_KEY = 'pp-sidebar-expanded';

  // Click-to-pin, not hover-to-expand — hover sidebars trigger and dismiss
  // accidentally (e.g. clicking an Inject pill near the edge collapses the
  // rail mid-click) and don't work for touch or keyboard users at all.
  let isExpanded = false;

  onMount(() => {
    isExpanded = localStorage.getItem(SIDEBAR_PIN_KEY) === '1';
  });

  function toggleExpanded() {
    isExpanded = !isExpanded;
    localStorage.setItem(SIDEBAR_PIN_KEY, isExpanded ? '1' : '0');
  }

  function scrollToSection(sectionIndex) {
    const cardElement = document.getElementById(`card-${sectionIndex}`);
    cardElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    appStore.closeMobileSidebar();
  }

  function injectTechniqueSnippet(targetBaseSection, snippetText, techniqueName) {
    const sections = $currentSections;
    const targetSection = sections.find(s => s.baseId === targetBaseSection) ?? sections[sections.length - 1];
    if (!targetSection) return;

    const existingValue = $appStore.sectionValues[targetSection.id] ?? '';
    const newValue = existingValue.trim()
      ? `${existingValue}\n\n[${techniqueName}]\n${snippetText}`
      : `[${techniqueName}]\n${snippetText}`;

    appStore.setSectionValue(targetSection.id, newValue);
    if ($appStore.currentMode !== 'write') appStore.setMode('write');
    showToast(`${techniqueName} injected into ${targetSection.fullTitle}`);

    // Focus the textarea after a short delay to allow the DOM to update
    setTimeout(() => {
      const textarea = document.getElementById(`textarea-${targetSection.index}`);
      textarea?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      textarea?.focus();
    }, 150);
  }

  // First 4 techniques shown as quick-inject pills in the sidebar
  $: quickInjectTechniques = TECHNIQUES.slice(0, 4);
</script>

<aside
  class="app-sidebar"
  class:is-expanded={isExpanded}
  class:is-mobile-open={$appStore.mobileSidebarOpen}
>

  <!-- Pin/unpin toggle — always visible, in both rail and expanded states -->
  <button
    class="sidebar-pin-button"
    on:click={toggleExpanded}
    title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
    aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
    aria-pressed={isExpanded}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
      {#if isExpanded}
        <polyline points="15 18 9 12 15 6"/>
      {:else}
        <polyline points="9 18 15 12 9 6"/>
      {/if}
    </svg>
  </button>

  <!-- Expanded header: framework name + progress (not in DOM when collapsed) -->
  {#if isExpanded || $appStore.mobileSidebarOpen}
    <div class="sidebar-header">
      <div class="sidebar-framework-name">{$activeFrameworkDefinition.name}</div>
      <div class="sidebar-progress">
        <div class="sidebar-progress-track">
          <div class="sidebar-progress-fill" style="width:{$completionStats.percentage}%"></div>
        </div>
        <span class="sidebar-progress-label">{$completionStats.percentage}% done</span>
      </div>
    </div>
    <div class="sidebar-section-label">Sections</div>
  {/if}

  <!-- Section nav items — dots always visible, text only when expanded -->
  {#each $currentSections as section (section.id)}
    {@const sectionColor = SECTION_COLORS[section.baseId] ?? SECTION_COLORS.role}
    {@const isEnabled = $appStore.enabledSections[section.id] ?? true}
    {@const isFilled  = !!$appStore.sectionValues[section.id]?.trim()}
    <button
      class="sidebar-nav-item"
      class:is-disabled={!isEnabled}
      class:is-filled={isFilled}
      on:click={() => scrollToSection(section.index)}
      title={isExpanded || $appStore.mobileSidebarOpen ? '' : `${section.fullTitle}${isFilled ? ' — filled' : ''}`}
    >
      <span class="sidebar-nav-dot" style="background:{sectionColor.hex}"></span>
      {#if isExpanded || $appStore.mobileSidebarOpen}
        <span class="sidebar-nav-number">{String(section.index + 1).padStart(2, '0')}</span>
        <span class="sidebar-nav-title">{section.fullTitle}</span>
        <span class="sidebar-nav-fill-indicator"></span>
      {/if}
    </button>
  {/each}

  <!-- Quick inject + footer: only rendered when expanded (no phantom spaces when collapsed) -->
  {#if isExpanded || $appStore.mobileSidebarOpen}
    <div class="sidebar-divider"></div>

    <div class="sidebar-quick-inject">
      <div class="sidebar-quick-inject-label">Quick Inject</div>
      {#each quickInjectTechniques as technique}
        <button
          class="inject-pill"
          on:click={() => injectTechniqueSnippet(technique.injectToSection, technique.snippet, technique.name)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
          {technique.name}
        </button>
      {/each}
      <button class="inject-pill" on:click={() => appStore.setMode('guide')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        All Techniques →
      </button>
    </div>

    <div class="sidebar-footer">
      <div class="sidebar-hint">
        Click <strong style="color:var(--color-accent-warning)">ⓘ</strong> to learn a section.
        Click <strong style="color:var(--color-accent)">📚</strong> for snippet starters.
      </div>
      <div style="display:flex;align-items:center;gap:4px;margin-top:8px">
        <span class="keyboard-key">⌘</span>
        <span class="keyboard-key">↵</span>
        <span style="font-size:11px;color:var(--color-text-muted);margin-left:2px">copy prompt</span>
      </div>
    </div>
  {/if}

</aside>
