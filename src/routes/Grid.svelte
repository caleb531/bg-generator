<script lang="ts">
  import { tick } from 'svelte';
  import { grid, type Grid } from '../stores/Grid';

  let tileWidth: number;
  let tileHeight: number;
  function recomputeConstants($grid: Grid) {
    tileWidth = ($grid.imageWidth - $grid.gridlineWidth * $grid.columnCount) / $grid.columnCount;
    tileHeight = ($grid.imageHeight - $grid.gridlineWidth * $grid.rowCount) / $grid.rowCount;
  }
  $: recomputeConstants($grid);

  let svgElement: SVGElement;
  let svgMarkup = '';
  async function exportSvgToString($grid: Grid, svgElement: SVGElement) {
    if (svgElement && $grid.fullScreen) {
      // Wait for SVG element to finish re-rendering before retrieving outerHTML
      // (source: <https://svelte.dev/tutorial/tick>)
      await tick();
      svgMarkup = svgElement.outerHTML;
    }
  }
  $: exportSvgToString($grid, svgElement);
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 {$grid.imageWidth} {$grid.imageHeight}"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  class="grid-canvas"
  class:is-fullscreen={$grid.fullScreen}
  style="background-color: {$grid.canvasBackgroundColor}"
  bind:this={svgElement}
>
  {#if $grid.imageBackgroundColor}
    <rect x="0" y="0" width="100%" height="100%" fill={$grid.imageBackgroundColor} />
  {/if}
  <!-- Gridlines -->
  <pattern
    id="gridlines"
    x="0"
    y="0"
    width={tileWidth + $grid.gridlineWidth}
    height={tileHeight + $grid.gridlineWidth}
    patternUnits="userSpaceOnUse"
  >
    <g fill={$grid.gridlineColor}>
      <rect x="0" y="0" width={$grid.gridlineWidth} height={tileHeight + $grid.gridlineWidth} />
      <rect x={$grid.gridlineWidth} y="0" width={tileWidth} height={$grid.gridlineWidth} />
    </g>
  </pattern>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gridlines)" />
  <!-- Grid Squares -->
  {#each { length: $grid.rowCount } as _, r}
    {#each { length: $grid.columnCount } as _, c}
      {@const tile = $grid.tiles[r][c]}
      <rect
        x={c * (tileWidth + $grid.gridlineWidth) + $grid.gridlineWidth}
        y={r * (tileHeight + $grid.gridlineWidth) + $grid.gridlineWidth}
        width={tileWidth}
        height={tileHeight}
        fill={tile.color}
      />
    {/each}
  {/each}
</svg>

{#if $grid.fullScreen && svgMarkup}
  <div
    class="grid-full-screen-image"
    style:background-size="{$grid.imageWidth}px {$grid.imageHeight}px"
    style:background-image="url('data:image/svg+xml;base64,{window.btoa(svgMarkup)}')"
  />
{/if}
