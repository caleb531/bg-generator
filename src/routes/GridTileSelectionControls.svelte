<script lang="ts">
  import {
    deselectAllTiles,
    getSelectedGridTiles,
    grid,
    selectAllTiles,
    type GridTile
  } from '../stores/Grid';
  import GridActionButton from './GridActionButton.svelte';
  import GridControlForm from './GridControlForm.svelte';
  import GridControlGroup from './GridControlGroup.svelte';

  let selectedGridTiles: GridTile[];
  $: selectedGridTiles = getSelectedGridTiles($grid);
</script>

<p>Selected Tiles: {selectedGridTiles.length}</p>

<GridControlForm>
  <GridControlGroup>
    <GridActionButton onAction={selectAllTiles}>Select All</GridActionButton>
    <GridActionButton onAction={deselectAllTiles}>Deselect All</GridActionButton>
  </GridControlGroup>
</GridControlForm>
