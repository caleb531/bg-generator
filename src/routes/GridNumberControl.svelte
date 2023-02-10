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
    <input
      class="grid-control-value"
      type="number"
      inputmode="decimal"
      pattern="[0-9]*"
      name={id}
      {min}
      {max}
      bind:value
      on:input={saveGrid}
    />
  </div>
  <div class="grid-control-row">
    <input
      class="grid-control-value-slider"
      aria-label="Slider for {label}"
      type="range"
      {min}
      {max}
      bind:value
      on:input={saveGrid}
    />
  </div>
</div>
