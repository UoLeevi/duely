import { hasProperty } from '@duely/util';

export class CacheEntry<T> {
  constructor(cache: Cache, key: string | null, value: T, visited?: Set<string>) {
    this.cache = cache;
    this.key = key;

    if (value === null || typeof value !== 'object') {
      this.isPrimitive = true;
      this.primitiveValue = value as any;
    } else {
      this.isPrimitive = false;
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          const field = value[key];
          const nestedEntry = cache.getOrUpdateCacheEntry(field, visited);
          this.fields.set(key, nestedEntry);
        }
      }

      const self = this;
      this.proxy = new Proxy<T & object, T & object>(value as any, {
        get(target, p) {
          return self.fields.get(p)?.value;
        }
      });
    }
  }

  readonly proxy?: T & object;
  readonly isPrimitive: boolean;
  readonly primitiveValue: string | number | bigint | boolean | undefined | symbol | null;
  readonly fields = new Map<string | symbol, CacheEntry<any>>();
  readonly cache: Cache;
  readonly key: string | null;

  get value() {
    return this.isPrimitive ? this.primitiveValue : this.proxy;
  }
}

export class Cache {
  #map = new Map<string, CacheEntry<any>>();
  getKey(value: any): string | null {
    if (!value) return null;
    if (!hasProperty(value, '__typename')) return null;
    if (!hasProperty(value, 'id')) return null;
    return `${value.__typename}: ${value.id}`;
  }

  getOrUpdateCacheEntry<T>(value: T, visited?: Set<string>): CacheEntry<T> {
    visited ??= new Set();
    const key = this.getKey(value);
    if (key === null) return new CacheEntry(this, key, value, visited);
    let entry = this.#map.get(key);

    if (!entry) {
      entry = new CacheEntry(this, key, value, visited);
      this.#map.set(key, entry);
      visited.add(key);
      return entry;
    }

    if (!entry.isPrimitive && !visited.has(key)) {
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          const field = value[key];
          const nestedEntry = this.getOrUpdateCacheEntry(field, visited);
          entry.fields.set(key, nestedEntry);
        }
      }
    }

    return entry;
  }
}
