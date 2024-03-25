// capitalize first letter of string
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// write generic normalize function
export const normalize = (
  value: number,
  min: number,
  max: number,
  newMin: number,
  newMax: number
) => newMin + ((value - min) * (newMax - newMin)) / (max - min);

// normalize rating (originally between -1 and 1) to between 0 and 1
export const normalizeRating = (rating: number) =>
  normalize(rating, -1, 1, 0, 1);

// normalize value to between 4 and 10
export const normalizeMarkerSize = (value: number) =>
  normalize(value, 0, 10, 4, 10);

export const normalizeFontSize = (value: number) =>
  normalize(value, 0, 1, 0.6, 0.9);

export const normalizeTextOffset = (value: number) =>
  normalize(value, 0, 1, 1.2, 1.8);
