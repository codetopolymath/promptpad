<script>
  import { marked } from 'marked';
  import { appStore, activeSections, activeFrameworkDefinition } from '../store.js';
  import { SECTION_COLORS } from '../data/sections.js';
</script>

{#if $activeSections.length === 0}
  <div class="preview-card">
    <p style="color:var(--color-text-secondary);font-style:italic;font-size:13px">
      Nothing written yet — switch to Write and fill in some sections.
    </p>
  </div>
{:else}
  <div class="preview-card">
    <div class="preview-header">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      Preview — {$activeFrameworkDefinition.name}
    </div>

    {#each $activeSections as section, i}
      {@const sectionColor = SECTION_COLORS[section.baseId] ?? SECTION_COLORS.role}
      <div class="preview-section">
        <div class="preview-section-label" style="color:{sectionColor.hex}">
          <span class="preview-section-dot" style="background:{sectionColor.hex}"></span>
          {section.shortLabel} — {section.fullTitle}
        </div>
        <div class="preview-section-body">
          {@html marked.parse($appStore.sectionValues[section.id] ?? '')}
        </div>
      </div>
      {#if i < $activeSections.length - 1}
        <hr class="preview-divider">
      {/if}
    {/each}
  </div>
{/if}
