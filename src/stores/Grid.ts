import { times } from 'lodash-es';
import { derived, get, writable } from 'svelte/store';
import { generateRandomOpacity } from '../routes/utils';

export interface GridTile {
  alpha: number;
}

export interface Grid {
  fullScreen: boolean;
  columnCount: number;
  rowCount: number;
  width: number;
  height: number;
  tiles: GridTile[];
  backgroundColor: string;
  tileColor: string;
}

export function generateGridTiles($grid: Omit<Grid, 'tiles'>): Grid['tiles'] {
  const tileCount = $grid.columnCount * $grid.rowCount;
  return times(tileCount, () => {
    return {
      alpha: generateRandomOpacity()
    };
  });
}
export const regenerateGridTiles = generateGridTiles;

export function resizeGrid($grid: Grid): Grid {
  const tileCount = $grid.columnCount * $grid.rowCount;
  return {
    ...$grid,
    tiles: times(
      tileCount,
      (i) =>
        $grid.tiles[i] || {
          alpha: generateRandomOpacity()
        }
    )
  };
}

export const defaultGrid: Omit<Grid, 'tiles'> = {
  fullScreen: false,
  columnCount: 10,
  rowCount: 10,
  width: 100,
  height: 100,
  backgroundColor: '#006688',
  tileColor: '#000000'
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
