<script lang="ts">
  import { browser } from '$app/environment';
  import '@fontsource/source-sans-pro/400.css';
  import '@fontsource/source-sans-pro/600.css';
  import '../styles/index.scss';
  import Grid from './Grid.svelte';
  import GridControls from './GridControls.svelte';
  import LoadingIndicator from './LoadingIndicator.svelte';
</script>

<svelte:head>
  <title>BG Generator | Caleb Evans</title>
</svelte:head>

{#if browser}
  <header class="app-sidebar">
    <h1 class="app-heading">BG Generator</h1>
    <GridControls />
  </header>
  <Grid />
{:else}
  <LoadingIndicator />
{/if}
