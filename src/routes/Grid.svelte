<script lang="ts">
  import { tick } from 'svelte';
  import {
    getTileHeight,
    getTileWidth,
    getTileX,
    getTileY,
    grid,
    saveGrid,
    toggleGridTileSelection,
    type Grid
  } from '../state/Grid.svelte';

  let tileWidth: number = $state(0);
  let tileHeight: number = $state(0);
  function recomputeConstants(grid: Grid): void {
    tileWidth = getTileWidth(grid);
    tileHeight = getTileHeight(grid);
  }
  $effect(() => {
    recomputeConstants(grid);
  });

  function handleSelectTile(event: MouseEvent): void {
    const rect = event.target as SVGRectElement;
    const rowIndex = parseInt(String(rect?.getAttribute('data-row-index')), 10);
    const columnIndex = parseInt(String(rect?.getAttribute('data-column-index')), 10);
    if (!(rowIndex >= 0 && columnIndex >= 0)) {
      return;
    }
    toggleGridTileSelection(rowIndex, columnIndex);
    saveGrid();
  }

  let svgElement: SVGElement | undefined = $state();
  let svgMarkup = $state('');
  async function exportSvgToString(grid: Grid, svgElement: SVGElement): Promise<void> {
    if (svgElement && grid.isPreviewing) {
      // Wait for SVG element to finish re-rendering before retrieving outerHTML
      // (source: <https://svelte.dev/tutorial/tick>)
      await tick();
      svgMarkup = svgElement.outerHTML;
    }
  }
  $effect(() => {
    if (svgElement) {
      exportSvgToString(grid, svgElement);
    }
  });
</script>

<svg
  role="none"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 {grid.imageWidth} {grid.imageHeight}"
  class="grid-canvas"
  class:is-previewing={grid.isPreviewing}
  style="background-color: {grid.canvasBackgroundColor}"
  bind:this={svgElement}
  onclick={handleSelectTile}
  onkeydown={() => {
    /* noop for now */
  }}
>
  {#if grid.imageBackgroundColor?.trim() && grid.imageBackgroundColor?.trim() !== 'transparent'}
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill={grid.imageBackgroundColor}
      class="grid-image-background-color"
      id="grid-image-background-color"
    />
  {/if}
  <!-- Gridlines -->
  {#if grid.gridlineWidth && grid.gridlineColor?.trim() && grid.gridlineColor?.trim() !== 'transparent'}
    <pattern
      id="grid-gridlines-pattern"
      x="0"
      y="0"
      width={tileWidth + grid.gridlineWidth}
      height={tileHeight + grid.gridlineWidth}
      patternUnits="userSpaceOnUse"
    >
      <g fill={grid.gridlineColor}>
        <rect
          x="0"
          y="0"
          width={grid.gridlineWidth}
          height={tileHeight + grid.gridlineWidth}
          id="grid-gridline-vertical"
        />
        <rect
          x={grid.gridlineWidth}
          y="0"
          width={tileWidth}
          height={grid.gridlineWidth}
          id="grid-gridline-horizontal"
        />
      </g>
    </pattern>
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill="url(#grid-gridlines-pattern)"
      class="grid-gridlines"
    />
  {/if}
  <!-- Grid Tiles -->
  <g id="grid-tiles">
    {#each { length: grid.rowCount } as _, rowIndex}
      {#each { length: grid.columnCount } as _, columnIndex}
        {@const tile = grid.tiles?.[rowIndex]?.[columnIndex]}
        {#if tile}
          <rect
            x={getTileX({ columnIndex, tileWidth, gridlineWidth: grid.gridlineWidth })}
            y={getTileY({ rowIndex, tileHeight, gridlineWidth: grid.gridlineWidth })}
            width={tileWidth}
            height={tileHeight}
            fill={tile.color || 'transparent'}
            class="grid-tile"
            class:is-selected={tile.isSelected}
            data-column-index={columnIndex}
            data-row-index={rowIndex}
          />
        {/if}
      {/each}
    {/each}
  </g>
</svg>

{#if grid.isPreviewing && svgMarkup}
  <div
    class="grid-preview-image"
    style:background-size="{grid.imageWidth}px {grid.imageHeight}px"
    style:background-image="url('data:image/svg+xml;base64,{window.btoa(svgMarkup)}')"
  ></div>
{/if}
