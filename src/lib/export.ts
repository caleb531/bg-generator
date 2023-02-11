import { get } from 'svelte/store';
import { grid } from '../stores/Grid';

// Retrieve the SVG markup of the current state of the grid as a string
export function getSvgMarkup() {
  const svgElement = document.querySelector('.grid-canvas');
  if (!svgElement) {
    return '';
  }
  const $grid = get(grid);
  const clonedSvgElement = svgElement.cloneNode(true) as SVGElement;
  clonedSvgElement.removeAttribute('class');
  clonedSvgElement.setAttribute('width', String($grid.width));
  clonedSvgElement.setAttribute('height', String($grid.height));
  return clonedSvgElement.outerHTML || '';
}

// Export the grid to an SVG file and trigger the file download immediately
// within the user's browser
export function exportSvg() {
  const svgMarkup = getSvgMarkup();
  const blob = new Blob([svgMarkup.trim() + '\n'], { type: 'image/svg+xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  // Let the browser pick a filename (it will still have an .svg extension due
  // to the MIME type defined on the blob)
  a.download = '';
  a.click();
}
