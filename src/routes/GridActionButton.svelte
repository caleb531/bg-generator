<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    type?: 'submit' | 'button';
    severity?: string | null;
    onAction: (event: MouseEvent) => void;
    children: Snippet;
  }

  let { type = 'button', severity = null, onAction, children }: Props = $props();
</script>

<button {type} class="grid-action-button" class:warning={severity === 'warning'} onclick={onAction}>
  {@render children?.()}
</button>
