<script lang="ts">
  import {
    deselectAllTiles,
    getSelectedGridTiles,
    grid,
    selectAllTiles,
    selectTilesWithColor,
    setColorForSelectedTiles,
    type GridTile
  } from '../stores/Grid';
  import GridActionButton from './GridActionButton.svelte';
  import GridColorControl from './GridColorControl.svelte';
  import GridControlForm from './GridControlForm.svelte';
  import GridControlGroup from './GridControlGroup.svelte';

  let selectedGridTiles: GridTile[] = [];
  // The new color to which to change
  let pendingNewTileColor: string = '';

  function handleSelectTilesWithColor() {
    selectTilesWithColor(selectedGridTiles[0]?.color ?? '');
  }

  function changeColorForSelectedTiles() {
    setColorForSelectedTiles(pendingNewTileColor);
  }

  $: selectedGridTiles = getSelectedGridTiles($grid);
</script>

<p>Selected Tiles: {selectedGridTiles.length}</p>

<GridControlForm>
  <GridControlGroup>
    <GridActionButton onAction={selectAllTiles}>Select All</GridActionButton>
    <GridActionButton onAction={deselectAllTiles}>Deselect All</GridActionButton>
    {#if selectedGridTiles.length === 1}
      <GridActionButton onAction={handleSelectTilesWithColor}
        >Select Tiles with Same Color</GridActionButton
      >
    {/if}
  </GridControlGroup>
  <GridControlGroup>
    <GridColorControl
      id="new_tile_color"
      label="New Tile Color"
      bind:value={pendingNewTileColor}
      placeholder="Enter a new color"
    />
    <GridActionButton type="submit" onAction={changeColorForSelectedTiles}
      >Change Color for {selectedGridTiles.length}
      {selectedGridTiles.length === 1 ? 'Tile' : 'Tiles'}</GridActionButton
    >
  </GridControlGroup>
</GridControlForm>
