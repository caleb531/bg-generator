<script lang="ts">
  import { browser } from '$app/environment';
  import '@fontsource/source-sans-pro/400-italic.css';
  import '@fontsource/source-sans-pro/400.css';
  import '@fontsource/source-sans-pro/600.css';
  import '../styles/index.scss';
  import AppSidebar from './AppSidebar.svelte';
  import Grid from './Grid.svelte';
</script>

<svelte:head>
  <title>BG Generator | Caleb Evans</title>
</svelte:head>

{#if browser}
  <AppSidebar />
  <div class="editor-area">
    <Grid />
  </div>
{/if}
