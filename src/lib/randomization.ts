// Generate a random opacity value (specifically for the background) such that
// the probabilities are uniformly distributed
export function generateRandomOpacityUniform() {
  return Math.random() * 0.3;
}

// Generate a random opacity value (this wrapper function exists to consolidate
// our choice of specific randomization algorithm)
export function generateRandomOpacity() {
  return generateRandomOpacityUniform();
}
