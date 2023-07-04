<script lang="ts">
  import { saveGrid } from '../stores/Grid';

  export let id: string;
  export let label: string;
  export let value: string;
  export let placeholder: string = '';

  let colorSwatchElement: HTMLDivElement;
  let isValid = true;

  function validateInputValue(event: Event): void {
    const input = event.target as HTMLInputElement;
    var div = document.createElement('div');
    div.style.color = input.value;
    if (div.style.color !== '' || input.value.trim() === '') {
      // Consider the value valid if it is a valid color value OR if it is empty
      value = input.value;
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
    <div class="grid-control-subrow">
      {#if isValid && value}
        <div
          class="grid-control-color-swatch"
          bind:this={colorSwatchElement}
          style="background-color: {value};"
        />
      {/if}
      <input
        id="grid-controls-{id}"
        type="text"
        name={id}
        {value}
        {placeholder}
        class:is-invalid={!isValid}
        on:input={validateInputValue}
      />
    </div>
  </div>
</div>
