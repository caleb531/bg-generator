<script lang="ts">
  export let type: 'submit' | 'button' = 'button';
  export let severity: string | null = null;
  export let onAction: (event: MouseEvent) => void;
</script>

<button
  {type}
  class="grid-action-button"
  class:warning={severity === 'warning'}
  on:click={onAction}
>
  <slot />
</button>
