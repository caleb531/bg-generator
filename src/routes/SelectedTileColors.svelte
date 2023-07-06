<script lang="ts">
  import { getColorsOfTiles, getSelectedGridTiles, grid } from '../stores/Grid';
  import GridColorControl from './GridColorControl.svelte';
  import GridControlForm from './GridControlForm.svelte';

  $: selectedColors = getColorsOfTiles(getSelectedGridTiles($grid));
</script>

<GridControlForm class="selected-tile-colors-form">
  <h2>Selected Colors</h2>
  {#each selectedColors as color, colorIndex}
    <GridColorControl
      id="selected_color_{colorIndex}"
      label="Selected Color {colorIndex + 1}"
      hideLabel={true}
      bind:value={color}
      readonly
    />
  {/each}
</GridControlForm>
