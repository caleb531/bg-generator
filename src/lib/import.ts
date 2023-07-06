import { times } from 'lodash-es';
import {
  getDefaultGridTile,
  getTileHeight,
  getTileWidth,
  getTileX,
  getTileY,
  grid,
  saveGrid,
  type Grid
} from '../stores/Grid';

export function getSvgElementFromMarkup(svgMarkup: string): HTMLElement {
  const parser = new window.DOMParser();
  const svgDocument = parser.parseFromString(svgMarkup, 'text/xml');
  return svgDocument.documentElement;
}

// To avoid binary rounding error, we round all x/y coordinates to the nearest several decimal places
export function normalizeRectCoord(coord: number | null): number {
  return Number(Number(coord).toFixed(5));
}

type RectCoordMap = Record<string, Record<string, SVGRectElement>>;

export function buildCoordMapFromRects(rects: SVGRectElement[]): RectCoordMap {
  const coordMap: RectCoordMap = {};
  rects.forEach((rect) => {
    const x = normalizeRectCoord(Number(rect.getAttribute('x')));
    const y = normalizeRectCoord(Number(rect.getAttribute('y')));
    if (!coordMap[x]) {
      coordMap[x] = {};
    }
    coordMap[x][y] = rect;
  });
  return coordMap;
}

// Update the grid properties by parsing and interpreting the given string of
// SVG markup
export function setGridFromSvg(svgMarkup: string): void {
  const svgElement = getSvgElementFromMarkup(svgMarkup);
  const [imageWidth, imageHeight] =
    svgElement.getAttribute('viewBox')?.split(' ').slice(-2).map(Number) ?? [];
  if (!imageWidth || !imageHeight) {
    console.error('width or height is not defined', imageWidth, imageHeight);
    return;
  }
  const imageBackgroundColor =
    svgElement.querySelector('#grid-image-background-color rect')?.getAttribute('fill') ||
    'transparent';

  const rects: SVGRectElement[] = Array.from(svgElement.querySelectorAll('#grid-tiles rect'));
  const rectCoordMap = buildCoordMapFromRects(rects);

  const gridlineWidth =
    Number(svgElement.querySelector('#grid-gridline-vertical')?.getAttribute('width')) || 0;
  const gridlineColor =
    svgElement.querySelector('#grid-gridlines-pattern [fill]')?.getAttribute('fill') ||
    'transparent';

  const columnCount = imageWidth / (Number(rects[0].getAttribute('width')) + gridlineWidth);
  const rowCount = imageHeight / (Number(rects[0].getAttribute('height')) + gridlineWidth);

  const tileWidth = getTileWidth({ imageWidth, gridlineWidth, columnCount });
  const tileHeight = getTileHeight({ imageHeight, gridlineWidth, rowCount });

  grid.update(($grid): Grid => {
    return {
      ...$grid,
      imageWidth,
      imageHeight,
      imageBackgroundColor,
      gridlineWidth,
      gridlineColor,
      columnCount,
      rowCount,
      tiles: times(rowCount, (rowIndex) => {
        return times(columnCount, (columnIndex) => {
          const x = normalizeRectCoord(getTileX({ columnIndex, tileWidth, gridlineWidth }));
          const y = normalizeRectCoord(getTileY({ rowIndex, tileHeight, gridlineWidth }));
          if (rectCoordMap[x]?.[y] !== undefined) {
            return {
              color: rectCoordMap[x][y].getAttribute('fill') || 'transparent'
            };
          } else {
            return getDefaultGridTile();
          }
        });
      })
    };
  });
  saveGrid();
}

// Upload the file specified by the given ChangeEvent for some file input
export function uploadFile(event: Event): void {
  const input = event.currentTarget as HTMLInputElement;
  console.log(input.files);
  if (!input.files?.length) {
    console.log('error uploading file; no file selected');
    return;
  }
  const reader = new FileReader();
  reader.onload = (event): void => {
    if (event.target?.result) {
      setGridFromSvg(String(event.target.result));
    }
  };
  reader.readAsText(input.files[0]);
}

// Prompt for an SVG file to import from the user's computer
export function promptForSvgToImport(): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/svg+xml';
  input.click();
  input.onchange = uploadFile;
}
