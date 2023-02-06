<script lang="ts">
    import { times } from 'lodash-es';
    interface GridSquare {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    let gridTiles: GridSquare[] = [];
    const canvasWidth = 100;
    const canvasHeight = canvasWidth;
    const tileWidth = 10;
    const tileHeight = tileWidth;
    const tileCount = canvasWidth * canvasHeight / tileWidth / tileHeight;
    function generateRandomOpacity() {
        return Math.random() * 0.5;
    }
    function generateGridTiles(): GridSquare[] {
        return times(tileCount, (i: number) => {
            return {
                x: (i * tileWidth) % canvasWidth,
                y: Math.floor(i / tileHeight) * tileHeight,
                width: tileWidth,
                height: tileHeight,
                fill: `rgba(0, 0, 0, ${generateRandomOpacity()})`
            }
        });
    }
    $: gridTiles = generateGridTiles();
</script>

<svg viewBox="0 0 {canvasWidth} {canvasHeight}" width="100%">
    {#each gridTiles as gridSquare}
        <rect {...gridSquare} />
    {/each}
</svg>

<style>
    svg {
        background-color: #068;
    }
</style>