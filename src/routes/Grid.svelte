<script lang="ts">
  import { browser } from '$app/environment';
  import { times } from 'lodash-es';
  import { grid } from '../stores/Grid';
  import type { GridTile } from './types';
  import { generateRandomOpacityUniform } from './utils';
  let gridTiles: GridTile[] = [];
  function generateGridTiles(): GridTile[] {
    const tileWidth = $grid.width / $grid.columnCount;
    const tileHeight = $grid.height / $grid.rowCount;
    const tileCount = $grid.columnCount * $grid.rowCount;
    return times(tileCount, (i: number) => {
      return {
        x: Math.floor(i % $grid.columnCount) * tileWidth,
        y: Math.floor(i / $grid.columnCount) * tileHeight,
        width: tileWidth,
        height: tileHeight,
        fill: browser ? `rgba(0, 0, 0, ${generateRandomOpacityUniform()})` : 'transparent'
      };
    });
  }
  $: gridTiles = generateGridTiles();
</script>

<svg viewBox="0 0 {$grid.width} {$grid.height}" class="image-canvas">
  <rect x="0" y="0" width="100%" height="100%" fill="#068" />
  {#each gridTiles as gridTile}
    <rect {...gridTile} />
  {/each}
</svg>
