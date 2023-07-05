import { get } from 'svelte/store';
import { grid } from '../stores/Grid';

// Retrieve the SVG markup of the current state of the grid as a string
export function getSvgMarkup(): string {
  const svgElement = document.querySelector('.grid-canvas');
  if (!svgElement) {
    return '';
  }
  const $grid = get(grid);
  const clonedSvgElement = svgElement.cloneNode(true) as SVGElement;
  clonedSvgElement.removeAttribute('class');
  clonedSvgElement.removeAttribute('style');
  clonedSvgElement.removeAttribute('role');
  clonedSvgElement.setAttribute('width', String($grid.imageWidth));
  clonedSvgElement.setAttribute('height', String($grid.imageHeight));
  // Process gridlines region and tiles as well
  Array.from(clonedSvgElement.querySelectorAll('rect')).forEach((rectElement) => {
    rectElement.removeAttribute('class');
    rectElement.removeAttribute('style');
    Object.keys(rectElement.dataset).forEach((key) => {
      delete rectElement.dataset[key];
    });
    const rectFill = rectElement.getAttribute('fill');
    // Remove tiles that blend in with the background of the SVG
    if (
      (rectFill === 'transparent' || rectFill === $grid.imageBackgroundColor) &&
      rectElement.getAttribute('id') !== 'grid-image-background-color'
    ) {
      rectElement.remove();
    }
  });
  return clonedSvgElement.outerHTML || '';
}

// Export the grid to an SVG file and trigger the file download immediately
// within the user's browser
export function exportSvg(): void {
  const svgMarkup = getSvgMarkup();
  const blob = new Blob([svgMarkup.trim() + '\n'], { type: 'image/svg+xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  // Let the browser pick a filename (it will still have an .svg extension due
  // to the MIME type defined on the blob)
  a.download = '';
  a.click();
}
