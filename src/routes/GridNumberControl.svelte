<script lang="ts">
  import { saveGrid } from '../stores/Grid';
  export let id: string;
  export let label: string;
  export let value: number;
  export let min: number | undefined = 0;
  export let max: number | undefined = undefined;

  let isValid = true;

  function validateInputValue(event: Event) {
    const input = event.target as HTMLInputElement;
    if (
      !isNaN(input.valueAsNumber) &&
      (!min || input.valueAsNumber >= min) &&
      (!max || input.valueAsNumber <= max)
    ) {
      // Consider the value valid if is a valid number and within the specified
      // boundaries
      value = input.valueAsNumber;
      isValid = true;
      saveGrid();
    } else {
      // Do not persist the value as long as it is invalid
      isValid = false;
    }
  }
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
      {value}
      class:is-invalid={!isValid}
      on:input={validateInputValue}
    />
  </div>
  <div class="grid-control-row">
    <input
      class="grid-control-value-slider"
      aria-label="Slider for {label}"
      type="range"
      {min}
      {max}
      {value}
      on:input={validateInputValue}
    />
  </div>
</div>
