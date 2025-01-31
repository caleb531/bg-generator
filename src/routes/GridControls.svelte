<script lang="ts">
  import { exportSvg } from '../lib/export';
  import { promptForSvgToImport } from '../lib/import';
  import { grid, saveGrid } from '../state/Grid.svelte';
  import GridActionButton from './GridActionButton.svelte';
  import GridColorControl from './GridColorControl.svelte';
  import GridControlForm from './GridControlForm.svelte';
  import GridControlGroup from './GridControlGroup.svelte';
  import GridControlSpacer from './GridControlSpacer.svelte';
  import GridNumberControl from './GridNumberControl.svelte';
  function togglePreviewMode(): void {
    grid.isPreviewing = !grid.isPreviewing;
    saveGrid();
  }
</script>

<GridControlForm>
  <GridControlGroup>
    <GridActionButton onAction={togglePreviewMode}>
      {#if grid.isPreviewing}
        Close Preview
      {:else}
        Preview BG
      {/if}
    </GridActionButton>
    <GridActionButton onAction={promptForSvgToImport}>Import SVG</GridActionButton>
    <GridActionButton onAction={exportSvg}>Export SVG</GridActionButton>
  </GridControlGroup>
  <GridControlGroup>
    <GridNumberControl
      id="column_count"
      label="Columns"
      min={1}
      max={50}
      bind:value={grid.columnCount}
    />
    <GridNumberControl id="row_count" label="Rows" min={1} max={50} bind:value={grid.rowCount} />
    <GridNumberControl
      id="width"
      label="Image Width"
      min={1}
      max={500}
      bind:value={grid.imageWidth}
    />
    <GridNumberControl
      id="image_height"
      label="Image Height"
      min={1}
      max={500}
      bind:value={grid.imageHeight}
    />
    <GridNumberControl
      id="gridline_width"
      label="Gridline Width"
      min={0}
      max={10}
      bind:value={grid.gridlineWidth}
    />
    <GridControlSpacer />
  </GridControlGroup>
  <GridControlGroup>
    <GridColorControl
      id="canvas_bg_color"
      label="Canvas BG"
      description="The background color of the canvas used for editing only; this color will not be part of the exported SVG"
      bind:value={grid.canvasBackgroundColor}
    />
    <GridColorControl
      id="image_bg_color"
      label="Image BG"
      description="The background color of the exported SVG image"
      bind:value={grid.imageBackgroundColor}
    />
    <GridColorControl
      id="gridline_color"
      label="Gridlines"
      description="The color of the gridlines between each tile in the grid"
      bind:value={grid.gridlineColor}
    />
  </GridControlGroup>
  <p class="hint">Click one or more tiles to select them and change their color</p>
</GridControlForm>
