<script lang="ts">
  import { saveGrid } from '../stores/Grid';
  interface Props {
    id: string;
    label: string;
    value: number;
    min?: number | undefined;
    max?: number | undefined;
  }

  let {
    id,
    label,
    value = $bindable(),
    min = 0,
    max = undefined
  }: Props = $props();

  let isValid = $state(true);

  function validateInputValue(event: Event) {
    const input = event.target as HTMLInputElement;
    if (
      !isNaN(input.valueAsNumber) &&
      (min === undefined || input.valueAsNumber >= min) &&
      (max === undefined || input.valueAsNumber <= max)
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

<div class="grid-control grid-number-control">
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
      oninput={validateInputValue}
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
      oninput={validateInputValue}
    />
  </div>
</div>
