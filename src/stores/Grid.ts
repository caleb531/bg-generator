import { times } from 'lodash-es';
import { derived, get, writable } from 'svelte/store';

export interface GridTile {
  color: string; // Supports hex, rgb(), rgba(), hsl(), etc.
}
export interface Grid {
  fullScreen: boolean;
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

export function generateGridTiles($grid: Omit<Grid, 'tiles'>): Grid['tiles'] {
  return times($grid.rowCount, () => {
    return times($grid.columnCount, () => {
      return {
        color: 'transparent'
      };
    });
  });
}
export const regenerateGridTiles = generateGridTiles;

export function resizeGrid($grid: Grid): Grid {
  return {
    ...$grid,
    tiles: times($grid.rowCount, (r) => {
      return times($grid.columnCount, (c) => {
        return (
          $grid.tiles[r][c] || {
            color: 'transparent'
          }
        );
      });
    })
  };
}

export const defaultGrid: Omit<Grid, 'tiles'> = {
  fullScreen: false,
  columnCount: 20,
  rowCount: 8,
  imageWidth: 200,
  imageHeight: 80,
  gridlineWidth: 1,
  gridlineColor: 'rgba(0, 0, 0, 0.1)',
  canvasBackgroundColor: '#fff',
  imageBackgroundColor: 'transparent'
};

// Retrieve user's persisted grid data from local browser storage
export function restoreGrid(): Grid {
  if (typeof localStorage === 'undefined') {
    return {
      ...defaultGrid,
      tiles: generateGridTiles({ ...defaultGrid })
    };
  }
  const rawValue = localStorage.getItem('bg-generator:grid');
  if (rawValue === null) {
    return { ...defaultGrid, tiles: generateGridTiles({ ...defaultGrid }) };
  }
  return {
    ...defaultGrid,
    ...JSON.parse(rawValue)
  };
}

export const grid = writable(restoreGrid());

// Watch for changes to individual grid properties
export const gridColumnCount = derived(grid, ($grid) => $grid.columnCount);
export const gridRowCount = derived(grid, ($grid) => $grid.rowCount);
gridColumnCount.subscribe(() => grid.update(resizeGrid));
gridRowCount.subscribe(() => grid.update(resizeGrid));

// Persist user's grid data to local browser storage
export function saveGrid() {
  if (typeof localStorage === 'undefined') {
    return;
  }
  const gridStoreToSave: Grid = get(grid);
  localStorage.setItem('bg-generator:grid', JSON.stringify(gridStoreToSave));
}

saveGrid();
