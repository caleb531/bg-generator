<script lang="ts">
  import { getSelectedGridTiles, grid, type GridTile } from '../stores/Grid';

  let selectedGridTiles: GridTile[];
  $: selectedGridTiles = getSelectedGridTiles($grid);
</script>

<h2>Selected Tiles: {selectedGridTiles.length}</h2>