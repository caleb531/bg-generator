import { browser } from '$app/environment';

// Generate a random opacity value (specifically for the background) such that
// the probabilities are uniformly distributed
export function generateRandomOpacityUniform() {
  return Math.random() * 0.3;
}

// Generate a random fill color for a grid tile
export function generateRandomFillColor() {
  return browser ? `rgba(0, 0, 0, ${generateRandomOpacityUniform()})` : 'transparent';
}
