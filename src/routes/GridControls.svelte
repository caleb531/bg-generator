<script lang="ts">
  import { grid, regenerateGridTiles, saveGrid } from '../stores/Grid';
  import GridActionButton from './GridActionButton.svelte';
  import GridColorControl from './GridColorControl.svelte';
  import GridNumberControl from './GridNumberControl.svelte';
  function randomizeGrid() {
    $grid.tiles = regenerateGridTiles($grid);
    saveGrid();
  }
  function toggleFullScreen() {
    $grid.fullScreen = !$grid.fullScreen;
    saveGrid();
  }
  function getSvgMarkup() {
    let svgMarkup = document.querySelector('.grid-canvas')?.outerHTML || '';
    svgMarkup = svgMarkup.replace('<svg ', `<svg width="${$grid.width}" height="${$grid.height}" `);
    return svgMarkup;
  }
  function exportSvg() {
    const svgMarkup = getSvgMarkup();
    let blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    // Let the browser pick a filename (it will still have an .svg extension due
    // to the MIME type defined on the blob)
    a.download = '';
    a.click();
  }
</script>

<form class="grid-controls" on:submit|preventDefault>
  <div class="grid-controls-group">
    <GridActionButton type="warning" onAction={randomizeGrid}>Randomize Grid</GridActionButton>
    <GridActionButton onAction={toggleFullScreen}>Toggle Fullscreen</GridActionButton>
  </div>
  <div class="grid-controls-group">
    <GridActionButton onAction={exportSvg}>Export SVG</GridActionButton>
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
