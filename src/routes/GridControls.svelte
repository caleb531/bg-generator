<script lang="ts">
  import { grid } from '../stores/Grid';
  import GridNumberControl from './GridNumberControl.svelte';
</script>

<form class="grid-controls" on:submit|preventDefault>
  <!-- TODO -->

  <GridNumberControl id="column_count" label="Columns" bind:value={$grid.columnCount} />
  <GridNumberControl id="row_count" label="Rows" bind:value={$grid.rowCount} />
  <GridNumberControl id="width" label="Width" bind:value={$grid.width} />
  <GridNumberControl id="height" label="Height" bind:value={$grid.height} />
</form>
