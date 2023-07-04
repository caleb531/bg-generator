<script lang="ts">
  import { getSelectedGridTiles, grid, type GridTile } from '../stores/Grid';

  let selectedGridTiles: GridTile[];
  $: selectedGridTiles = getSelectedGridTiles($grid);
</script>

<p>Selected Tiles: {selectedGridTiles.length}</p>
