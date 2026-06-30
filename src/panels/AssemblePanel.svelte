<script>
  import { appStore, activeSections, showToast } from '../store.js';
  import { assemblePromptText } from '../lib/promptUtils.js';

  $: assembledText = assemblePromptText($activeSections, $appStore.sectionValues);
  $: wordCount     = assembledText.trim() ? assembledText.trim().split(/\s+/).length : 0;
  $: charCount     = assembledText.length;
  $: tokenEstimate = Math.round(charCount / 4);

  let justCopied = false;
  let isFlashing = false;
  let copiedResetTimer;
  let flashResetTimer;

  // The end of the core flow (write → copy) deserves a clearer "you're
  // done" moment than a toast alone — Peak-End: people judge the whole
  // experience disproportionately by how it concludes.
  function copyAll() {
    if (!assembledText.trim()) { showToast('Nothing to copy yet', true); return; }
    navigator.clipboard.writeText(assembledText).then(() => {
      showToast('Prompt copied! ✓');
      justCopied = true;
      isFlashing = true;
      clearTimeout(copiedResetTimer);
      clearTimeout(flashResetTimer);
      copiedResetTimer = setTimeout(() => { justCopied = false; }, 1600);
      flashResetTimer  = setTimeout(() => { isFlashing = false; }, 700);
    });
  }
</script>

<div class="assemble-header">
  <span class="assemble-title">Assembled Prompt</span>
  <button class="button is-primary" class:is-copied={justCopied} on:click={copyAll}>
    {#if justCopied}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Copied!
    {:else}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2"/>
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
      </svg>
      Copy All
    {/if}
  </button>
</div>

<div class="assemble-body" class:is-flashing={isFlashing}>
  {assembledText || 'Nothing written yet.'}
</div>

<div class="assemble-meta">
  <span><strong>{wordCount.toLocaleString()}</strong> words</span>
  <span><strong>{charCount.toLocaleString()}</strong> chars</span>
  <span><strong>{tokenEstimate.toLocaleString()}</strong> est. tokens</span>
</div>
