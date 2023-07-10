<script lang="ts">
  import {
    deselectAllTiles,
    getColorsOfTiles,
    getFlatListOfTiles,
    getSelectedGridTiles,
    grid,
    saveGrid,
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
  let selectedColors: string[] = [];
  let selectedColorsSet: Set<string> = new Set();
  // The new color to which to change
  let pendingNewTileColor: string = '';

  function handleSelectAll() {
    selectAllTiles();
    saveGrid();
  }
  function handleDeselectAll() {
    deselectAllTiles();
    saveGrid();
  }

  function handleSelectTilesWithColor() {
    selectTilesWithColor(selectedGridTiles[0]?.color ?? '');
    pendingNewTileColor = selectedGridTiles[0]?.color;
  }

  function changeColorForSelectedTiles() {
    setColorForSelectedTiles(pendingNewTileColor);
  }
  function clearColorForSelectedTiles() {
    setColorForSelectedTiles('transparent');
  }

  $: selectedGridTiles = getSelectedGridTiles($grid);
  $: selectedColors = getColorsOfTiles(selectedGridTiles);
  $: selectedColorsSet = new Set(selectedColors);
  $: otherColors = [...getColorsOfTiles(getFlatListOfTiles($grid))].filter(
    (color) => !selectedColorsSet.has(color)
  );
</script>

<p>Selected Tiles: {selectedGridTiles.length}</p>

<GridControlForm>
  <GridControlGroup>
    <GridActionButton onAction={handleSelectAll}>Select All</GridActionButton>
    <GridActionButton onAction={handleDeselectAll}>Deselect All</GridActionButton>
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
    <GridActionButton severity="warning" onAction={clearColorForSelectedTiles}
      >Clear Color for {selectedGridTiles.length}
      {selectedGridTiles.length === 1 ? 'Tile' : 'Tiles'}</GridActionButton
    >
  </GridControlGroup>
  {#if selectedColors.length}
    <GridControlGroup>
      <h2>Selected Colors</h2>
      {#each selectedColors as color, colorIndex}
        <div class="selected-tile-color">
          <GridActionButton
            onAction={() => {
              pendingNewTileColor = color;
            }}>Use Color</GridActionButton
          >
          <GridColorControl
            id="selected_color_{colorIndex}"
            label="Selected Color {colorIndex + 1}"
            hideLabel={true}
            bind:value={color}
            readonly
          />
        </div>
      {/each}
    </GridControlGroup>
  {/if}
  {#if otherColors.length}
    <GridControlGroup>
      <h2>Other Available Colors</h2>
      {#each otherColors as color, colorIndex}
        <div class="selected-tile-color">
          <GridActionButton
            onAction={() => {
              pendingNewTileColor = color;
            }}>Use Color</GridActionButton
          >
          <GridColorControl
            id="other_color_{colorIndex}"
            label="Other Available Color {colorIndex + 1}"
            hideLabel={true}
            bind:value={color}
            readonly
          />
        </div>
      {/each}
    </GridControlGroup>
  {/if}
</GridControlForm>
