<script lang="ts">
  import { createBubbler, preventDefault } from 'svelte/legacy';

  const bubble = createBubbler();
  interface Props {
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let { ...props }: Props = $props();
</script>

<form class="grid-controls" onsubmit={preventDefault(bubble('submit'))} {...props}>
  {@render props.children?.()}
</form>
