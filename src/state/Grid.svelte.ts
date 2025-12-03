import { times } from 'lodash-es';
import { untrack } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';

export interface GridTile {
  isSelected?: boolean;
  color: string; // Supports hex, rgb(), rgba(), hsl(), etc.
}
export interface Grid {
  isPreviewing: boolean;
  columnCount: number;
  rowCount: number;
  imageWidth: number;
  imageHeight: number;
  gridlineWidth: number;
  gridlineColor: string;
  canvasBackgroundColor: string; // Not part of exported SVG
  imageBackgroundColor: string; // Is part of exported SVG
  tiles: GridTile[][]; // A two-dimensional array of every tile in the grid; the total number of tiles must be equal to rowCount * columnCount; the rendering optimization mentioned in idea (1) will be responsible for not rendering invisible tiles
}

export function forEachTile(grid: Grid, callback: (tile: GridTile) => void): void {
  grid.tiles.forEach((row) => {
    row.forEach(callback);
  });
}

export function getDefaultGridTile(): GridTile {
  return {
    color: 'transparent'
  };
}

export function generateGridTiles(grid: Omit<Grid, 'tiles'>): Grid['tiles'] {
  return times(grid.rowCount, () => {
    return times(grid.columnCount, () => {
      return getDefaultGridTile();
    });
  });
}
export const regenerateGridTiles = generateGridTiles;

export function resizeGrid(grid: Grid): Grid {
  return {
    ...grid,
    tiles: times(grid.rowCount, (rowIndex) => {
      return times(grid.columnCount, (columnIndex) => {
        return (
          grid.tiles?.[rowIndex]?.[columnIndex] ?? {
            color: 'transparent'
          }
        );
      });
    })
  };
}

export function getSelectedGridTiles(grid: Grid): GridTile[] {
  const selectedTiles: GridTile[] = [];
  forEachTile(grid, (tile) => {
    if (tile.isSelected) {
      selectedTiles.push(tile);
    }
  });
  return selectedTiles;
}

export const defaultGrid: Omit<Grid, 'tiles'> = {
  isPreviewing: false,
  columnCount: 20,
  rowCount: 8,
  imageWidth: 200,
  imageHeight: 80,
  gridlineWidth: 1,
  gridlineColor: 'rgb(0 0 0 / 0.1)',
  canvasBackgroundColor: '#fff',
  imageBackgroundColor: 'transparent'
};

export const grid = $state(restoreGrid());

// Retrieve user's persisted grid data from local browser storage
export function restoreGrid(): Grid {
  if (typeof localStorage === 'undefined') {
    return {
      ...defaultGrid,
      tiles: generateGridTiles({ ...defaultGrid })
    };
  }
  const rawValue = localStorage.getItem('bg-generator-v1:grid');
  if (rawValue === null) {
    return { ...defaultGrid, tiles: generateGridTiles({ ...defaultGrid }) };
  }
  return {
    ...defaultGrid,
    ...JSON.parse(rawValue)
  };
}

export function getTileWidth({
  imageWidth,
  gridlineWidth,
  columnCount
}: {
  imageWidth: number;
  gridlineWidth: number;
  columnCount: number;
}): number {
  return Math.abs(imageWidth - gridlineWidth * columnCount) / columnCount;
}

export function getTileHeight({
  imageHeight,
  gridlineWidth,
  rowCount
}: {
  imageHeight: number;
  gridlineWidth: number;
  rowCount: number;
}): number {
  return Math.abs(imageHeight - gridlineWidth * rowCount) / rowCount;
}

export function getTileX({
  columnIndex,
  tileWidth,
  gridlineWidth
}: {
  columnIndex: number;
  tileWidth: number;
  gridlineWidth: number;
}): number {
  return columnIndex * (tileWidth + gridlineWidth) + gridlineWidth;
}
export function getTileY({
  rowIndex,
  tileHeight,
  gridlineWidth
}: {
  rowIndex: number;
  tileHeight: number;
  gridlineWidth: number;
}): number {
  return rowIndex * (tileHeight + gridlineWidth) + gridlineWidth;
}

export function toggleGridTileSelection(rowIndex: number, columnIndex: number): void {
  grid.tiles[rowIndex][columnIndex].isSelected = !grid.tiles[rowIndex][columnIndex].isSelected;
}

export function selectAllTiles(): void {
  forEachTile(grid, (tile) => {
    tile.isSelected = true;
  });
}

export function deselectAllTiles(): void {
  forEachTile(grid, (tile) => {
    tile.isSelected = false;
  });
}

export function selectTilesWithColor(color: string): void {
  forEachTile(grid, (tile) => {
    if (tile.color === color) {
      tile.isSelected = true;
    }
  });
}

export function getColorsOfTiles(tiles: GridTile[]): string[] {
  return Array.from(
    new SvelteSet(
      tiles.map((tile) => {
        return tile.color;
      })
    )
  );
}

export function setColorForSelectedTiles(color: string): void {
  getSelectedGridTiles(grid).forEach((tile) => {
    tile.color = color?.trim() || 'transparent';
  });
}

export function getFlatListOfTiles(grid: Grid): GridTile[] {
  const tiles: GridTile[] = [];
  forEachTile(grid, (tile) => {
    tiles.push(tile);
  });
  return tiles;
}

// Persist user's grid data to local browser storage
export function saveGrid(): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem('bg-generator-v1:grid', JSON.stringify(grid));
}

// Watch for changes to individual grid properties
$effect.root(() => {
  $effect(() => {
    if (grid.columnCount && grid.rowCount) {
      Object.assign(
        grid,
        // Ensure that no other grid properties are tracked, only columnCount
        // and rowCount
        untrack(() => resizeGrid(grid))
      );
    }
  });
});

saveGrid();
