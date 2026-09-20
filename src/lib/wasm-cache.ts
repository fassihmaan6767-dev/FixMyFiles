/**
 * WASM & Core Binary IndexedDB Cache
 * FixMyFiles.app — 100% Client-Side Persistent Caching
 * 
 * Caches large WebAssembly binaries and JS runtime files locally
 * so subsequent exports load in ~10ms without hitting the network.
 */

const DB_NAME = 'fixmyfiles_wasm_cache_v1';
const STORE_NAME = 'wasm_binaries';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieves a cached binary as ArrayBuffer or fetches and caches it.
 * Returns a fast Blob URL for WebAssembly.instantiateStreaming or script loading.
 */
export async function getCachedWasmUrl(
  url: string,
  mimeType: string = 'application/wasm',
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const db = await openDB();

    // 1. Try reading from IndexedDB
    const cachedBuffer = await new Promise<ArrayBuffer | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(url);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });

    if (cachedBuffer) {
      const blob = new Blob([cachedBuffer], { type: mimeType });
      return URL.createObjectURL(blob);
    }

    // 2. Fetch with progress if not cached
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch WASM binary from ${url}: ${response.statusText}`);
    }

    const contentLength = Number(response.headers.get('content-length')) || 0;
    let arrayBuffer: ArrayBuffer;

    if (contentLength > 0 && response.body) {
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let receivedBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          receivedBytes += value.length;
          if (onProgress) {
            onProgress(Math.min(95, Math.round((receivedBytes / contentLength) * 100)));
          }
        }
      }

      // Combine chunks into single ArrayBuffer
      const combined = new Uint8Array(receivedBytes);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }
      arrayBuffer = combined.buffer;
    } else {
      arrayBuffer = await response.arrayBuffer();
    }

    // 3. Store in IndexedDB for instant future loads
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(arrayBuffer, url);
    } catch (cacheErr) {
      console.warn('Could not cache WASM to IndexedDB:', cacheErr);
    }

    const blob = new Blob([arrayBuffer], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('IndexedDB cache bypassed, using direct URL:', err);
    return url;
  }
}

/**
 * Clear WASM cache if user requests or for maintenance
 */
export async function clearWasmCache(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
  } catch (err) {
    console.error('Failed to clear WASM cache:', err);
  }
}
