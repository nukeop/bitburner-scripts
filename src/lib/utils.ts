export const minBy = <T>(arr: T[], fn: (item: T) => number): T | undefined => {
  let min: T | undefined;
  let minVal = Infinity;
  for (const item of arr) {
    const val = fn(item);
    if (val < minVal) {
      minVal = val;
      min = item;
    }
  }
  return min;
};
