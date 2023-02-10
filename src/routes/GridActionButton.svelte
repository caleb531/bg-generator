<script lang="ts">
  export let type: string | null = null;
  export let onAction: (event: MouseEvent) => void;
</script>

<button
  type="button"
  class="grid-action-button"
  class:warning={type === 'warning'}
  on:click={onAction}
>
  <slot />
</button>
