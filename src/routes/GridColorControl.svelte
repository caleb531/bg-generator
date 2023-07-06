<script lang="ts">
  import { saveGrid } from '../stores/Grid';

  export let id: string;
  export let label: string;
  export let value: string;
  export let readonly = false;
  export let hideLabel = false;
  export let placeholder: string = '';

  let isValid = true;

  function doesColorHaveAlpha(color: string): boolean {
    return color?.trim() === '' || color === 'transparent' || /a\(/.test(color) || /\//.test(color);
  }

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

<div class="grid-control grid-color-control">
  <div class="grid-control-row">
    <label for="grid-controls-{id}" class:invisible={hideLabel}>{label}:</label>
    <div class="grid-control-subrow">
      {#if isValid && value}
        <div class="grid-control-color-swatch">
          {#if doesColorHaveAlpha(value)}
            <div class="grid-control-color-swatch-alpha" />
          {/if}
          <div class="grid-control-color-swatch-color" style="background-color: {value}" />
        </div>
      {/if}
      <input
        id="grid-controls-{id}"
        type="text"
        name={id}
        {value}
        {placeholder}
        {readonly}
        class:is-invalid={!isValid}
        on:input={validateInputValue}
      />
    </div>
  </div>
</div>
