<script lang="ts">
  import { exportSvg } from '../lib/export';
  import { promptForSvgToImport } from '../lib/import';
  import { grid, regenerateGridTiles, saveGrid } from '../stores/Grid';
  import GridActionButton from './GridActionButton.svelte';
  import GridColorControl from './GridColorControl.svelte';
  import GridControlGroup from './GridControlGroup.svelte';
  import GridControlSpacer from './GridControlSpacer.svelte';
  import GridNumberControl from './GridNumberControl.svelte';
  function randomizeGrid() {
    $grid.tiles = regenerateGridTiles($grid);
    saveGrid();
  }
  function toggleFullScreen() {
    $grid.fullScreen = !$grid.fullScreen;
    saveGrid();
  }
</script>

<form class="grid-controls" on:submit|preventDefault>
  <GridControlGroup>
    <GridActionButton type="warning" onAction={randomizeGrid}>Randomize Grid</GridActionButton>
    <GridActionButton onAction={toggleFullScreen}>
      {#if $grid.fullScreen}
        Disable Fullscreen
      {:else}
        Enable Fullscreen
      {/if}
    </GridActionButton>
    <GridActionButton onAction={exportSvg}>Export SVG</GridActionButton>
    <GridActionButton type="file" onAction={promptForSvgToImport}>Import SVG</GridActionButton>
  </GridControlGroup>
  <GridControlGroup>
    <GridNumberControl
      id="column_count"
      label="Columns"
      min={1}
      max={50}
      bind:value={$grid.columnCount}
    />
    <GridNumberControl id="row_count" label="Rows" min={1} max={50} bind:value={$grid.rowCount} />
    <GridNumberControl
      id="width"
      label="Image Width"
      min={1}
      max={500}
      bind:value={$grid.imageWidth}
    />
    <GridNumberControl
      id="image_height"
      label="Image Height"
      min={1}
      max={500}
      bind:value={$grid.imageHeight}
    />
    <GridNumberControl
      id="gridline_width"
      label="Gridline Width"
      min={1}
      max={500}
      bind:value={$grid.gridlineWidth}
    />
    <GridControlSpacer />
  </GridControlGroup>
  <GridControlGroup>
    <GridColorControl id="bg_color" label="Canvas BG" bind:value={$grid.canvasBackgroundColor} />
    <GridColorControl id="bg_color" label="Image BG" bind:value={$grid.imageBackgroundColor} />
    <GridColorControl id="gridline_color" label="Gridlines" bind:value={$grid.gridlineColor} />
  </GridControlGroup>
</form>
