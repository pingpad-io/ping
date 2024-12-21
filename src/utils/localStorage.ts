import type { IObservableStorageProvider, StorageProviderSubscriber } from "@lens-protocol/storage";
import { window } from "./globals";

class LocalStorageProvider implements IObservableStorageProvider {
  private subscribers = new Map<string, StorageProviderSubscriber[]>();

  getItem(key: string) {
    return window?.localStorage.getItem(key) ?? null;
  }

  setItem(key: string, value: string) {
    window?.localStorage.setItem(key, value);
  }

  removeItem(key: string) {
    window?.localStorage.removeItem(key);
  }

  subscribe(key: string, subscriber: StorageProviderSubscriber) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key)?.push(subscriber);
    } else {
      this.subscribers.set(key, [subscriber]);
    }

    if (this.subscribers.size === 1) {
      this.listenToStorageEvent();
    }

    return {
      unsubscribe: () => {
        const subscribers = this.subscribers.get(key) ?? [];

        const index = subscribers.indexOf(subscriber);

        if (index > -1) {
          subscribers.splice(index, 1);
        }

        if (subscribers.length === 0) {
          this.subscribers.delete(key);
        }

        if (this.subscribers.size === 0) {
          this.stopListeningToStorageEvent();
        }
      },
    };
  }

  private onStorageEvent = (event: StorageEvent) => {
    if (event.storageArea !== window?.localStorage) {
      return;
    }

    if (event.key && this.subscribers.has(event.key)) {
      const subscribers = this.subscribers.get(event.key) ?? [];
      // biome-ignore lint/complexity/noForEach: intended usage
      subscribers.forEach((subscriber) => subscriber(event.newValue, event.oldValue));
    }
  };

  private listenToStorageEvent() {
    window?.addEventListener("storage", this.onStorageEvent);
  }

  private stopListeningToStorageEvent() {
    window?.removeEventListener("storage", this.onStorageEvent);
  }
}

export function localStorage(): IObservableStorageProvider {
  return new LocalStorageProvider();
}
interface WagmiStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

// Separate localStorage implementation for wagmi
export function wagmiLocalStorage(): WagmiStorage {
  return {
    getItem(key: string) {
      return window?.localStorage.getItem(key);
    },
    setItem(key: string, value: string) {
      window?.localStorage.setItem(key, value);
    },
    removeItem(key: string) {
      window?.localStorage.removeItem(key);
    }
  };
}

interface WagmiStorage {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}

export class CookieStorageProvider implements IObservableStorageProvider, WagmiStorage {
  private subscribers = new Map<string, StorageProviderSubscriber[]>();
  private cookies: Map<string, string>;

  constructor() {
    // Parse document.cookie on client-side initialization
    this.cookies = new Map(
      (typeof document !== "undefined" ? document.cookie : "")
        .split(";")
        .map(cookie => cookie.trim())
        .filter(Boolean)
        .map(cookie => cookie.split("=").map(decodeURIComponent) as [string, string])
    );
  }

  getItem(key: string): string | null {
    return this.cookies.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.cookies.set(key, value);
    
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
    
    const subscribers = this.subscribers.get(key);
    if (subscribers) {
      const oldValue = this.getItem(key);
      for (const subscriber of subscribers) {
        subscriber(value, oldValue);
      }
    }
  }

  removeItem(key: string): void {
    this.cookies.delete(key);
    document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    
    const subscribers = this.subscribers.get(key);
    if (subscribers) {
      const oldValue = this.getItem(key);
      for (const subscriber of subscribers) {
        subscriber(null, oldValue);
      }
    }
  }

  subscribe(key: string, subscriber: StorageProviderSubscriber) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }
    this.subscribers.get(key)?.push(subscriber);

    return {
      unsubscribe: () => {
        const subscribers = this.subscribers.get(key) ?? [];
        const index = subscribers.indexOf(subscriber);
        if (index > -1) {
          subscribers.splice(index, 1);
        }
        if (subscribers.length === 0) {
          this.subscribers.delete(key);
        }
      }
    };
  }
}

export function cookieStorage(): WagmiStorage {
  return new CookieStorageProvider();
}
