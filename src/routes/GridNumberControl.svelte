<script lang="ts">
  import { saveGrid } from '../stores/Grid';
  export let id: string;
  export let label: string;
  export let value: number;
  export let min: number;
  export let max: number;
</script>

<div class="grid-control">
  <div class="grid-control-row">
    <label for="grid-controls-{id}">{label}</label>
  </div>
  <div class="grid-control-row">
    <input
      id="grid-controls-{id}"
      type="number"
      name={id}
      {min}
      {max}
      bind:value
      on:input={saveGrid}
    />
  </div>
</div>
