import { get, writable } from 'svelte/store';

export interface Grid {
  fullScreen: boolean;
  columnCount: number;
  rowCount: number;
  width: number;
  height: number;
}

export const defaultGrid = {
  fullScreen: false,
  columnCount: 10,
  rowCount: 10,
  width: 100,
  height: 100
};

// Retrieve user's persisted grid data from local browser storage
export function restoreGrid(): Grid {
  if (typeof localStorage === 'undefined') {
    return {
      ...defaultGrid
    };
  }
  const rawValue = localStorage.getItem('bg-generator:grid');
  if (rawValue === null) {
    return defaultGrid;
  }
  return {
    ...defaultGrid,
    ...JSON.parse(rawValue)
  };
}

export const grid = writable(restoreGrid());

// Persist user's grid data to local browser storage
export function saveGrid() {
  if (typeof localStorage === 'undefined') {
    return;
  }
  const gridStoreToSave: Grid = get(grid);
  localStorage.setItem('bg-generator:grid', JSON.stringify(gridStoreToSave));
}
