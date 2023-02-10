<script lang="ts">
  import { tick } from 'svelte';
  import { grid, type Grid } from '../stores/Grid';

  let tileWidth: number;
  let tileHeight: number;
  function recomputeConstants($grid: Grid) {
    tileWidth = $grid.width / $grid.columnCount;
    tileHeight = $grid.height / $grid.rowCount;
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
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 {$grid.width} {$grid.height}"
  class="grid-canvas"
  class:is-fullscreen={$grid.fullScreen}
  preserveAspectRatio="none"
  bind:this={svgElement}
>
  <rect x="0" y="0" width="100%" height="100%" fill={$grid.backgroundColor} />
  <g fill={$grid.tileColor}>
    {#each $grid.tiles as gridTile, i}
      <rect
        x={Math.floor(i % $grid.columnCount) * tileWidth}
        y={Math.floor(i / $grid.columnCount) * tileHeight}
        width={tileWidth}
        height={tileHeight}
        opacity={gridTile.alpha}
      />
    {/each}
  </g>
</svg>

{#if $grid.fullScreen && svgMarkup}
  <div
    class="grid-full-screen-image"
    style:background-size="{$grid.width}px {$grid.height}px"
    style:background-image="url('data:image/svg+xml;base64,{window.btoa(svgMarkup)}')"
  />
{/if}
