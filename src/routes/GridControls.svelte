<script lang="ts">
  import { grid } from '../stores/Grid';
  import GridNumberControl from './GridNumberControl.svelte';
</script>

<form class="grid-controls" on:submit|preventDefault>
  <!-- TODO -->

  <GridNumberControl
    id="column_count"
    label="Columns"
    min={0}
    max={50}
    bind:value={$grid.columnCount}
  />
  <GridNumberControl id="row_count" label="Rows" min={1} max={50} bind:value={$grid.rowCount} />
  <GridNumberControl id="width" label="Width" min={1} max={500} bind:value={$grid.width} />
  <GridNumberControl id="height" label="Height" min={1} max={500} bind:value={$grid.height} />
</form>
