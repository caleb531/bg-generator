<script lang="ts">
  import { saveGrid } from '../stores/Grid';
  export let id: string;
  export let label: string;
  export let value: number;
  export let min: number | undefined = 0;
  export let max: number | undefined = undefined;
</script>

<div class="grid-control">
  <div class="grid-control-row">
    <label for="grid-controls-{id}">{label}:</label>
    <span class="grid-control-value">{value}</span>
  </div>
  <div class="grid-control-row">
    <input
      id="grid-controls-{id}"
      type="range"
      name={id}
      {min}
      {max}
      bind:value
      on:input={saveGrid}
    />
  </div>
</div>
