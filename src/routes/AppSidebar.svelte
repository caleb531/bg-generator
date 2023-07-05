<script lang="ts">
  import { getSelectedGridTiles, grid, type GridTile } from '../stores/Grid';
  import GridControls from './GridControls.svelte';
  import GridTileSelectionControls from './GridTileSelectionControls.svelte';

  let selectedGridTiles: GridTile[];
  $: selectedGridTiles = getSelectedGridTiles($grid);
</script>

<header class="app-sidebar">
  <h1 class="app-heading">BG Generator</h1>
  <span class="author-nav-link">by <a href="https://calebevans.me/">Caleb Evans</a></span>
  {#if selectedGridTiles.length}
    <GridTileSelectionControls />
  {:else}
    <GridControls />
  {/if}
</header>
