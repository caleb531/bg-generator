<script lang="ts">
  import { times } from 'lodash-es';
  import type { GridSquare } from './types';
  let gridTiles: GridSquare[] = [];
  const canvasWidth = 100;
  const canvasHeight = canvasWidth;
  const colCount = 10;
  const rowCount = 10;
  const tileWidth = canvasWidth / colCount;
  const tileHeight = canvasHeight / rowCount;
  const tileCount = colCount * rowCount;
  function generateRandomOpacity() {
    return Math.random() * 0.3;
  }
  function generateGridTiles(): GridSquare[] {
    return times(tileCount, (i: number) => {
      return {
        x: Math.floor(i % colCount) * tileWidth,
        y: Math.floor(i / colCount) * tileHeight,
        width: tileWidth,
        height: tileHeight,
        fill: `rgba(0, 0, 0, ${generateRandomOpacity()})`
      };
    });
  }
  $: gridTiles = generateGridTiles();
</script>

<svg viewBox="0 0 {canvasWidth} {canvasHeight}" width="100%">
  <rect x="0" y="0" width="100%" height="100%" fill="#068" />
  {#each gridTiles as gridTile}
    <rect {...gridTile} />
  {/each}
</svg>

<style>
  svg {
    width: 100%;
    max-height: calc(100vh - 120px);
  }
</style>
