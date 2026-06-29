<script>
  import { appStore, currentSections, activeFrameworkDefinition } from '../store.js';
  import SectionCard from '../components/SectionCard.svelte';
</script>

<div class="write-panel-title">
  <h1>Structure your thinking.</h1>
  <p>
    Pick a framework, fill in the sections, click
    <strong style="color:var(--color-accent-warning)">ⓘ</strong> to learn.
    Open <strong style="color:var(--color-accent)">Guide</strong> for frameworks and techniques.
    Auto-saved to your browser.
  </p>
</div>

<!-- Framework banner (hidden for Custom since it has no specific description to surface) -->
{#if $appStore.activeFramework !== 'custom'}
  <div class="framework-banner">
    <div class="framework-banner-icon">{$activeFrameworkDefinition.icon}</div>
    <div>
      <div class="framework-banner-name">{$activeFrameworkDefinition.name}</div>
      <div class="framework-banner-description">{$activeFrameworkDefinition.description}</div>
      <div class="framework-banner-best-used">{$activeFrameworkDefinition.bestUsedWhen}</div>
    </div>
  </div>
{/if}

<!-- Section cards — keyed by id so Svelte re-animates when framework changes -->
<div class="section-card-list">
  {#each $currentSections as section (section.id + $appStore.activeFramework)}
    <SectionCard {section} />
  {/each}
</div>
