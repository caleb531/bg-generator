<script lang="ts">
    import { browser } from '$app/environment';
    import Grid from './Grid.svelte';
</script>

<h1>Background Generator</h1>

{#if browser}
    <Grid />
{/if}

<style lang="scss">
    
    :global(body) {
        min-height: 100%;
        margin: 0;
        padding: 0 40px;
        font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: #222;
        text-align: center;
        color: #fff;
    }
    :global(h1) {
        margin: 20px 0;
    }
    :global(a) {
        color: inherit;
    }

</style>