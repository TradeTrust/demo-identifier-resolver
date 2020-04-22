import NodeCache from "node-cache";

const myCache = new NodeCache({ stdTTL: 60 * 5 }); // Cache the results for 5 mins

export async function memoize<T>(fn: () => Promise<T>, cacheKey: string): Promise<T> {
  const valueFromCache = myCache.get<T>(cacheKey);
  if (valueFromCache) return valueFromCache;
  const freshValue = await fn();
  myCache.set(cacheKey, freshValue);
  return freshValue;
}
