// Shared Utility Functions

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const lowercase = (s) => s.toLowerCase();
export const uppercase = (s) => s.toUpperCase();
export const trimSpaces = (s) => s.trim();
export const isNotEmpty = (val) => val !== null && val !== undefined && val !== '';
export const isEmpty = (val) => !isNotEmpty(val);
export const toFixed2 = (num) => Number(num).toFixed(2);
export const toFixed4 = (num) => Number(num).toFixed(4);
export const parseJSON = (str) => { try { return JSON.parse(str); } catch { return null; } };
export const stringifyJSON = (obj) => JSON.stringify(obj, null, 2);
export const getTimestamp = () => Date.now();
export const getISODate = () => new Date().toISOString();
