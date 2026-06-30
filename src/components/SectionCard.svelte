<script>
  import { onMount } from 'svelte';
  import { appStore, showToast } from '../store.js';
  import { SECTION_COLORS } from '../data/sections.js';
  import { DEFAULT_SNIPPETS } from '../data/techniques.js';

  export let section; // { index, id, baseId, shortLabel, fullTitle, placeholder, tip }

  $: sectionColor = SECTION_COLORS[section.baseId] ?? SECTION_COLORS.role;
  $: isEnabled    = $appStore.enabledSections[section.id] ?? true;
  $: isFocused    = false;

  // Input value synced with the store.
  // The reactive statement keeps the local value up-to-date when external
  // changes arrive (e.g. snippet applied, load from file, clear).
  let inputValue = '';
  $: {
    const storedValue = $appStore.sectionValues[section.id] ?? '';
    if (storedValue !== inputValue) inputValue = storedValue;
  }

  let textareaElement;
  let showTip      = false;
  let showSnippets = false;
  let isFlashing   = false;

  $: allSnippets = [
    ...(DEFAULT_SNIPPETS[section.baseId] ?? []),
    ...($appStore.savedSnippets[section.id]  ?? []),
    ...($appStore.savedSnippets[section.baseId] ?? []),
  ];

  onMount(() => {
    if (textareaElement && inputValue) autoResizeTextarea(textareaElement);
  });

  function autoResizeTextarea(element) {
    element.style.height = 'auto';
    element.style.height = Math.max(100, element.scrollHeight) + 'px';
  }

  function handleInput(event) {
    inputValue = event.target.value;
    appStore.setSectionValue(section.id, inputValue);
    autoResizeTextarea(event.target);
    // Keep sidebar dot in sync
    const navItem = document.querySelector(`[data-nav-id="${section.index}"]`);
    if (navItem) navItem.classList.toggle('is-filled', !!inputValue.trim());
  }

  function handleFocus() {
    isFocused = true;
    document.querySelector(`[data-nav-id="${section.index}"]`)?.classList.add('is-focused');
  }

  function handleBlur() {
    isFocused = false;
    document.querySelector(`[data-nav-id="${section.index}"]`)?.classList.remove('is-focused');
  }

  function copySection() {
    if (!inputValue.trim()) { showToast('Section is empty', true); return; }
    navigator.clipboard.writeText(inputValue).then(() => {
      showToast('Section copied!');
      isFlashing = true;
      setTimeout(() => { isFlashing = false; }, 500);
    });
  }

  function applySnippet(snippetText) {
    appStore.setSectionValue(section.id, snippetText);
    showSnippets = false;
    // Resize textarea after reactive update settles
    setTimeout(() => { if (textareaElement) autoResizeTextarea(textareaElement); }, 0);
    showToast('Snippet applied');
  }

  function saveCurrentAsSnippet() {
    if (!inputValue.trim()) { showToast('Section is empty — nothing to save', true); return; }
    const existingSnippets = [
      ...(DEFAULT_SNIPPETS[section.baseId] ?? []),
      ...($appStore.savedSnippets[section.id] ?? []),
    ];
    if (existingSnippets.includes(inputValue.trim())) { showToast('Already saved'); return; }
    appStore.saveSnippet(section.id, inputValue.trim());
    showToast('Saved as snippet!');
  }

  function toggleSnippetDropdown(event) {
    event.stopPropagation();
    showSnippets = !showSnippets;
  }

  // Close snippet dropdown when clicking elsewhere
  function handleDocumentClick() {
    showSnippets = false;
  }
</script>

<svelte:document on:click={handleDocumentClick} />

{#if !isEnabled}
  <!-- Collapsed disabled banner — clearly shows the section is off and how to re-enable -->
  <div class="section-card-disabled-banner">
    <span class="disabled-banner-dot" style="background:{sectionColor.hex}"></span>
    <span class="disabled-banner-title">{section.fullTitle}</span>
    <span class="disabled-banner-label">disabled</span>
    <button class="disabled-banner-enable-button" on:click={() => appStore.enableSection(section.id)}>
      Enable
    </button>
  </div>
{:else}
  <!-- Full section card -->
  <div
    id="card-{section.index}"
    class="section-card"
    class:is-focused={isFocused}
    class:is-flashing={isFlashing}
    style="--section-color:{sectionColor.hex};--section-bg:{sectionColor.background}"
  >
    <div class="card-index-tab">
      <span class="card-index-letter">{section.shortLabel.charAt(0).toUpperCase()}</span>
    </div>

    <div class="card-body">
      <div class="card-header">
        <span class="card-number">{String(section.index + 1).padStart(2, '0')}</span>
        <span
          class="card-label"
          style="color:{sectionColor.hex};background:{sectionColor.background};border-color:{sectionColor.hex}33"
        >{section.shortLabel}</span>
        <span class="card-title">{section.fullTitle}</span>

        <div class="card-actions">
          <!-- Info / tip toggle -->
          <button
            class="card-icon-button is-info"
            title="Learn about this section"
            on:click={() => showTip = !showTip}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </button>

          <!-- Snippet picker -->
          <button
            class="card-icon-button is-snip"
            title="Snippets"
            on:click={toggleSnippetDropdown}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
          </button>

          <!-- Copy section -->
          <button
            class="card-icon-button is-copy"
            title="Copy section"
            on:click={copySection}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
          </button>

          <!-- Toggle off (disable) -->
          <button
            class="toggle-switch is-on"
            title="Disable this section"
            on:click={() => appStore.toggleSection(section.id)}
          >
            <span class="toggle-thumb"></span>
          </button>

          <!-- Snippet dropdown -->
          {#if showSnippets}
            <div class="snippet-dropdown" on:click|stopPropagation>
              <div class="snippet-dropdown-header">
                <span class="snippet-dropdown-title">{section.fullTitle}</span>
                <span style="font-size:11px;color:var(--color-text-muted)">{allSnippets.length} snippets</span>
              </div>

              {#if allSnippets.length}
                {#each allSnippets as snippetText}
                  <button class="snippet-item" on:click={() => applySnippet(snippetText)}>
                    <span class="snippet-item-text">{snippetText}</span>
                    <span class="snippet-item-use-badge">Use</span>
                  </button>
                {/each}
              {:else}
                <p style="font-size:12px;color:var(--color-text-muted);padding:4px 0">No snippets yet.</p>
              {/if}

              <button class="snippet-save-button" on:click={saveCurrentAsSnippet}>
                + Save current text as snippet
              </button>
            </div>
          {/if}
        </div>
      </div>

      <!-- Textarea -->
      <div class="card-editor">
        <textarea
          id="textarea-{section.index}"
          bind:this={textareaElement}
          class="section-textarea"
          placeholder={section.placeholder}
          bind:value={inputValue}
          on:input={handleInput}
          on:focus={handleFocus}
          on:blur={handleBlur}
          rows="5"
          data-nav-id={section.index}
        ></textarea>
      </div>

      <div class="char-count">{inputValue.length} chars</div>

      <!-- Tip panel (toggled by ⓘ button) -->
      {#if showTip}
        <div class="tip-panel">
          <div class="tip-heading is-what">📌 What is this?</div>
          <p>{section.tip.whatItIs}</p>
          <div class="tip-heading is-why" style="margin-top:10px">🧠 Why it matters</div>
          <p>{section.tip.whyItMatters}</p>
          <div class="tip-heading is-example" style="margin-top:10px">✍️ Example</div>
          <div class="tip-example">{section.tip.example}</div>
        </div>
      {/if}
    </div>
  </div>
{/if}
