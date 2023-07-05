import { times } from 'lodash-es';
import {
  Grid,
  getTileHeight,
  getTileWidth,
  getTileX,
  getTileY,
  grid,
  saveGrid
} from '../stores/Grid';

// Update the grid properties by parsing and interpreting the given string of
// SVG markup
export function setGridFromSvg(svgMarkup: string): void {
  const parser = new window.DOMParser();
  const svgDocument = parser.parseFromString(svgMarkup, 'text/xml');
  const svgElement = svgDocument.documentElement;
  const [imageWidth, imageHeight] =
    svgElement.getAttribute('viewBox')?.split(' ').slice(-2).map(Number) ?? [];
  if (!imageWidth || !imageHeight) {
    console.error('width or height is not defined', imageWidth, imageHeight);
    return;
  }
  const rects = Array.from(svgElement.querySelectorAll('#grid-tiles rect'));
  const rectsSet = new Set(rects);
  const imageBackgroundColor =
    svgElement.querySelector('#grid-image-background-color rect')?.getAttribute('fill') || '';
  const columnCount = imageWidth / Number(rects[0].getAttribute('width'));
  const rowCount = imageHeight / Number(rects[0].getAttribute('height'));
  const gridlineWidth = Number(
    svgElement.querySelector('#grid-gridline-vertical')?.getAttribute('width')
  );
  grid.update(($grid): Grid => {
    return {
      ...$grid,
      imageWidth,
      imageHeight,
      imageBackgroundColor,
      columnCount,
      rowCount,
      tiles: times(rowCount, (r) => {
        return times(columnCount, (c) => {
          const tileWidth = getTileWidth({ imageWidth, gridlineWidth, columnCount });
          const tileHeight = getTileHeight({ imageHeight, gridlineWidth, rowCount });
          const x = getTileX({ columnIndex: c, tileWidth, gridlineWidth });
          const y = getTileY({ rowIndex: r, tileHeight, gridlineWidth });
          // TODO: replace this dummy GridTile object with the logic that maps
          // tiles in the SVG to tiles in the data structure
          return {
            color: 'transparent'
          };
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
