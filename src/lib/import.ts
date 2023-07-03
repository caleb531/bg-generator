import { defaultGrid, grid, saveGrid } from '../stores/Grid';

// Update the grid properties by parsing and interpreting the given string of
// SVG markup
export function setGridFromSvg(svgMarkup: string) {
  const parser = new window.DOMParser();
  const svgDocument = parser.parseFromString(svgMarkup, 'text/xml');
  const svgElement = svgDocument.documentElement;
  const [width, height] =
    svgElement.getAttribute('viewBox')?.split(' ').slice(-2).map(Number) ?? [];
  if (!width || !height) {
    console.error('width or height is not defined', width, height);
    return;
  }
  const rects = Array.from(svgElement.querySelectorAll('rect'));
  const backgroundColor = rects[0].getAttribute('fill') ?? defaultGrid.backgroundColor;
  const tileColor = svgElement.querySelector('g')?.getAttribute('fill') ?? defaultGrid.tileColor;
  const columnCount = width / Number(rects[1].getAttribute('width'));
  const rowCount = height / Number(rects[1].getAttribute('height'));
  grid.update(($grid) => {
    return {
      ...$grid,
      width,
      height,
      backgroundColor,
      tileColor,
      columnCount,
      rowCount,
      tiles: rects.slice(1).map((rect) => {
        return { alpha: Number(rect.getAttribute('opacity')) };
      })
    };
  });
  saveGrid();
}

// Upload the file specified by the given ChangeEvent for some file input
export function uploadFile(event: Event) {
  const input = event.currentTarget as HTMLInputElement;
  console.log(input.files);
  if (!input.files?.length) {
    console.log('error uploading file; no file selected');
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    if (event.target?.result) {
      setGridFromSvg(String(event.target.result));
    }
  };
  reader.readAsText(input.files[0]);
}

// Prompt for an SVG file to import from the user's computer
export function promptForSvgToImport() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/svg+xml';
  input.click();
  input.onchange = uploadFile;
}
