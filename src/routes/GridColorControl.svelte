<script lang="ts">
  import { saveGrid } from '../stores/Grid';
  export let id: string;
  export let label: string;
  export let value: string;
</script>

<div class="grid-control">
  <div class="grid-control-row">
    <label for="grid-controls-{id}">{label}:</label>
    <input id="grid-controls-{id}" type="text" name={id} bind:value on:input={saveGrid} />
  </div>
</div>
