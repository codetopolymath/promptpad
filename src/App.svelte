<script>
  import { onMount } from 'svelte';
  import { appStore } from './store.js';
  import { parseShareURLHash } from './lib/promptUtils.js';
  import Header from './components/Header.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import Toast from './components/Toast.svelte';
  import WritePanel from './panels/WritePanel.svelte';
  import PreviewPanel from './panels/PreviewPanel.svelte';
  import AssemblePanel from './panels/AssemblePanel.svelte';
  import GuidePanel from './panels/GuidePanel.svelte';

  let isHeaderHidden = false;
  let lastScrollY = 0;

  onMount(() => {
    // Restore theme from localStorage
    const savedTheme = localStorage.getItem('pp-theme') || 'dark';
    document.documentElement.dataset.theme = savedTheme;

    // Load state from a shared URL if present
    const sharedState = parseShareURLHash(location.hash);
    if (sharedState) {
      appStore.loadExternalState(sharedState);
      history.replaceState(null, '', location.pathname);
    }

    // Auto-hide header on scroll down, reveal on scroll up
    function handleScroll() {
      const currentScrollY = window.scrollY;
      isHeaderHidden = currentScrollY > 80 && currentScrollY > lastScrollY;
      lastScrollY = currentScrollY;
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });

  function handleKeydown(event) {
    const modKey = event.metaKey || event.ctrlKey;
    if (modKey && event.key === 'Enter') { event.preventDefault(); /* copyFull handled in Header */ }
    if (modKey && event.key === '1') { event.preventDefault(); appStore.setMode('write'); }
    if (modKey && event.key === '2') { event.preventDefault(); appStore.setMode('preview'); }
    if (modKey && event.key === '3') { event.preventDefault(); appStore.setMode('assemble'); }
    if (modKey && event.key === '4') { event.preventDefault(); appStore.setMode('guide'); }
    if (event.key === 'Escape') {
      appStore.closeMobileSidebar();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Mobile sidebar backdrop -->
<div
  class="mobile-overlay"
  class:is-visible={$appStore.mobileSidebarOpen}
  on:click={appStore.closeMobileSidebar}
></div>

<Header {isHeaderHidden} />
<Sidebar />

<div class="app-shell">
  <main class="panel" class:is-active={$appStore.currentMode === 'write'}>
    <WritePanel />
  </main>
  <div class="panel" class:is-active={$appStore.currentMode === 'preview'}>
    <PreviewPanel />
  </div>
  <div class="panel" class:is-active={$appStore.currentMode === 'assemble'}>
    <AssemblePanel />
  </div>
  <div class="panel" class:is-active={$appStore.currentMode === 'guide'}>
    <GuidePanel />
  </div>
</div>

<!-- Mobile bottom tabs -->
<div class="mobile-bottom-tabs">
  {#each [
    { mode: 'write',    label: 'Write',    icon: '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>' },
    { mode: 'preview',  label: 'Preview',  icon: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' },
    { mode: 'assemble', label: 'Assemble', icon: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>' },
    { mode: 'guide',    label: 'Guide',    icon: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
  ] as tab}
    <button
      class="mobile-tab-button"
      class:is-active={$appStore.currentMode === tab.mode}
      on:click={() => appStore.setMode(tab.mode)}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        {@html tab.icon}
      </svg>
      {tab.label}
    </button>
  {/each}
</div>

<Toast />
