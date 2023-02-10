<script lang="ts">
  import { grid, regenerateGridTiles, saveGrid } from '../stores/Grid';
  import GridColorControl from './GridColorControl.svelte';
  import GridNumberControl from './GridNumberControl.svelte';
  function toggleFullScreen() {
    $grid.fullScreen = !$grid.fullScreen;
    saveGrid();
  }
  function randomizeGrid() {
    $grid.tiles = regenerateGridTiles($grid);
    saveGrid();
  }
</script>

<form class="grid-controls" on:submit|preventDefault>
  <div class="grid-controls-group">
    <button type="button" class="warning" on:click={randomizeGrid}>Randomize Grid</button>
    <button type="button" on:click={toggleFullScreen}>Toggle Fullscreen</button>
  </div>
  <div class="grid-controls-group">
    <GridNumberControl
      id="column_count"
      label="Columns"
      min={0}
      max={50}
      bind:value={$grid.columnCount}
    />
    <GridNumberControl id="row_count" label="Rows" min={1} max={50} bind:value={$grid.rowCount} />
  </div>
  <div class="grid-controls-group">
    <GridNumberControl id="width" label="Width" min={1} max={500} bind:value={$grid.width} />
    <GridNumberControl id="height" label="Height" min={1} max={500} bind:value={$grid.height} />
  </div>
  <div class="grid-controls-group">
    <GridColorControl id="bg_color" label="BG Color" bind:value={$grid.backgroundColor} />
    <GridColorControl id="tile_color" label="Tile Color" bind:value={$grid.tileColor} />
  </div>
</form>
