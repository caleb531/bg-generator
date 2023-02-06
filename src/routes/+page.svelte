<script lang="ts">
  import { browser } from '$app/environment';
  import '../styles/index.scss';
  import Grid from './Grid.svelte';
</script>

<h1>Background Generator</h1>

{#if browser}
  <Grid />
{/if}
