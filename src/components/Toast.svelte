<script>
  import { toastState } from '../store.js';
</script>

<div
  class="toast-notification"
  class:is-visible={$toastState.visible}
  class:is-error={$toastState.isError}
>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
    {#if $toastState.isError}
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    {:else}
      <polyline points="20 6 9 17 4 12"/>
    {/if}
  </svg>
  {$toastState.message}
</div>
