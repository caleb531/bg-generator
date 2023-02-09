<script lang="ts">
  import { browser } from '$app/environment';
  import '../styles/index.scss';
  import Grid from './Grid.svelte';
  import GridControls from './GridControls.svelte';
  import LoadingIndicator from './LoadingIndicator.svelte';
</script>

<svelte:head>
  <title>BG Generator | Caleb Evans</title>
</svelte:head>

{#if browser}
  <header class="app-header">
    <h1 class="app-heading">BG Generator</h1>
    <GridControls />
  </header>
  <Grid />
{:else}
  <LoadingIndicator />
{/if}
