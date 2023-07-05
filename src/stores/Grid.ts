import { times } from 'lodash-es';
import { derived, get, writable } from 'svelte/store';

export interface GridTile {
  isSelected?: boolean;
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

export function forEachTile($grid: Grid, callback: (tile: GridTile) => void): void {
  $grid.tiles.forEach((row) => {
    row.forEach(callback);
  });
}

export function getDefaultGridTile(): GridTile {
  return {
    color: 'transparent'
  };
}

export function generateGridTiles($grid: Omit<Grid, 'tiles'>): Grid['tiles'] {
  return times($grid.rowCount, () => {
    return times($grid.columnCount, () => {
      return getDefaultGridTile();
    });
  });
}
export const regenerateGridTiles = generateGridTiles;

export function resizeGrid($grid: Grid): Grid {
  return {
    ...$grid,
    tiles: times($grid.rowCount, (rowIndex) => {
      return times($grid.columnCount, (columnIndex) => {
        return (
          $grid.tiles?.[rowIndex]?.[columnIndex] ?? {
            color: 'transparent'
          }
        );
      });
    })
  };
}

export function getSelectedGridTiles($grid: Grid): GridTile[] {
  const selectedTiles: GridTile[] = [];
  forEachTile($grid, (tile) => {
    if (tile.isSelected) {
      selectedTiles.push(tile);
    }
  });
  return selectedTiles;
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
  grid.update(($grid) => {
    $grid.tiles[rowIndex][columnIndex].isSelected = !$grid.tiles[rowIndex][columnIndex].isSelected;
    return $grid;
  });
}

export function selectAllTiles(): void {
  grid.update(($grid) => {
    forEachTile($grid, (tile) => {
      tile.isSelected = true;
    });
    return $grid;
  });
}

export function deselectAllTiles(): void {
  grid.update(($grid) => {
    forEachTile($grid, (tile) => {
      tile.isSelected = false;
    });
    return $grid;
  });
}

export function selectTilesWithColor(color: string): void {
  grid.update(($grid) => {
    forEachTile($grid, (tile) => {
      if (tile.color === color) {
        tile.isSelected = true;
      }
    });
    return $grid;
  });
}

export function getColorsOfTiles(tiles: GridTile[]): string[] {
  return Array.from(
    new Set(
      tiles.map((tile) => {
        return tile.color;
      })
    )
  );
}

export function setColorForSelectedTiles(color: string): void {
  grid.update(($grid) => {
    getSelectedGridTiles($grid).forEach((tile) => {
      tile.color = color;
    });
    return $grid;
  });
}

// Persist user's grid data to local browser storage
export function saveGrid(): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  const gridStoreToSave: Grid = get(grid);
  localStorage.setItem('bg-generator:grid', JSON.stringify(gridStoreToSave));
}

// Watch for changes to individual grid properties
export const gridColumnCount = derived(grid, ($grid) => $grid.columnCount);
export const gridRowCount = derived(grid, ($grid) => $grid.rowCount);
gridColumnCount.subscribe(() => grid.update(resizeGrid));
gridRowCount.subscribe(() => grid.update(resizeGrid));

saveGrid();
