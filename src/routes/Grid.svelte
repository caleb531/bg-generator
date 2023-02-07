<script lang="ts">
  import { grid, type Grid } from '../stores/Grid';

  let tileWidth: number;
  let tileHeight: number;
  function recomputeConstants($grid: Grid) {
    tileWidth = $grid.width / $grid.columnCount;
    tileHeight = $grid.height / $grid.rowCount;
  }
  $: recomputeConstants($grid);
</script>

<svg
  viewBox="0 0 {$grid.width} {$grid.height}"
  class="image-canvas"
  class:is-fullscreen={$grid.fullScreen}
>
  <rect x="0" y="0" width="100%" height="100%" fill="#068" />
  {#each $grid.tiles as gridTile, i}
    <rect
      x={Math.floor(i % $grid.columnCount) * tileWidth}
      y={Math.floor(i / $grid.columnCount) * tileHeight}
      width={tileWidth}
      height={tileHeight}
      fill={gridTile.fill}
    />
  {/each}
</svg>
