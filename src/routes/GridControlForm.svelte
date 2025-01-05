<script lang="ts">
  import type { Snippet } from 'svelte';
  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<form class="grid-controls" onsubmit={(event) => event.preventDefault()}>
  {@render children()}
</form>
