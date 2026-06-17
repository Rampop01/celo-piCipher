// Shared Utility Functions

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const lowercase = (s) => s.toLowerCase();
export const uppercase = (s) => s.toUpperCase();
export const trimSpaces = (s) => s.trim();
export const isNotEmpty = (val) => val !== null && val !== undefined && val !== '';
