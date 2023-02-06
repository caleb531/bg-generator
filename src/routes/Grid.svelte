<script lang="ts">
  import { browser } from '$app/environment';
  import { times } from 'lodash-es';
  import type { GridSquare } from './types';
  import { generateRandomOpacityUniform } from './utils';
  let gridTiles: GridSquare[] = [];
  const canvasWidth = 100;
  const canvasHeight = canvasWidth;
  const colCount = 10;
  const rowCount = 10;
  const tileWidth = canvasWidth / colCount;
  const tileHeight = canvasHeight / rowCount;
  const tileCount = colCount * rowCount;
  function generateGridTiles(): GridSquare[] {
    return times(tileCount, (i: number) => {
      return {
        x: Math.floor(i % colCount) * tileWidth,
        y: Math.floor(i / colCount) * tileHeight,
        width: tileWidth,
        height: tileHeight,
        fill: browser ? `rgba(0, 0, 0, ${generateRandomOpacityUniform()})` : 'transparent'
      };
    });
  }
  $: gridTiles = generateGridTiles();
</script>

<svg viewBox="0 0 {canvasWidth} {canvasHeight}" class="image-canvas">
  <rect x="0" y="0" width="100%" height="100%" fill="#068" />
  {#each gridTiles as gridTile}
    <rect {...gridTile} />
  {/each}
</svg>
