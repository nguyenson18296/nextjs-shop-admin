/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export function cloneDeep<T>(item: T, seen = new WeakMap<object>()): T {
  if (item === null || typeof item !== 'object') {
    return item; // Return the value if it's not an object
  }

  if (seen.has(item)) {
    return seen.get(item);
  }

  let copy: any;

  // Handling Array and Object cases separately
  if (Array.isArray(item)) {
    copy = [];
    seen.set(item, copy);
    item.forEach((elem, index) => {
      copy[index] = cloneDeep(elem, seen);
    });
    return copy as T;
  }

  // Handling other object types (including built-in types like Date, Set, Map)
  if (item instanceof Date) {
    copy = new Date(item);
    seen.set(item, copy);
    return copy as T;
  }

  if (item instanceof Map) {
    copy = new Map();
    seen.set(item, copy);
    item.forEach((value, key) => {
      copy.set(key, cloneDeep(value, seen));
    });
    return copy as T;
  }

  if (item instanceof Set) {
    copy = new Set();
    seen.set(item, copy);
    item.forEach((value) => {
      copy.add(cloneDeep(value, seen));
    });
    return copy as T;
  }

  // Cloning generic objects
  copy = Object.create(Object.getPrototypeOf(item));
  seen.set(item, copy);
  Object.keys(item).forEach((key) => {
    copy[key] = cloneDeep((item as Record<string, any>)[key], seen);
  });
  
  return copy as T;
}

export function isEqual<T>(value: T, other: T): boolean {
  // Compare if both are exactly the same (including 'NaN' comparison)
  if (value === other || (Number.isNaN(value) && Number.isNaN(other))) {
    return true;
  }

  // If both are not objects, they must be unequal (since strict comparison failed)
  if (typeof value !== 'object' || typeof other !== 'object' || value === null || other == null) {
    return false;
  }

  // Handle Date comparison
  if (value instanceof Date && other instanceof Date) {
    return value.getTime() === other.getTime();
  }

  // Handle Array comparison
  if (Array.isArray(value) && Array.isArray(other)) {
    if (value.length !== other.length) return false;
    for (let i = 0; i < value.length; i++) {
      if (!isEqual(value[i], other[i])) return false;
    }
    return true;
  }

  // Handle objects and Maps
  const valueProps = Object.keys(value);
  const otherProps = Object.keys(other);

  if (valueProps.length !== otherProps.length) {
    return false;
  }

  for (const key of valueProps) {
    if (!otherProps.includes(key) || !isEqual((value as any)[key], (other as any)[key])) {
      return false;
    }
  }

  return true;
}