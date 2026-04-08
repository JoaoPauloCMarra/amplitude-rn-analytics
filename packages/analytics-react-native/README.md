# amplitude-rn-analytics

Storage-agnostic React Native analytics SDK compatible with Amplitude services.

This fork removes the hard dependency on `@react-native-async-storage/async-storage`.
It ships with a built-in shared memory storage fallback and keeps the upstream
custom `storageProvider` hook so apps can inject persistent storage.

## Install

```sh
npm install amplitude-rn-analytics
```

## Default storage behavior

If you call `init()` without a `storageProvider`, the SDK uses built-in
in-memory storage.

That is fine for tests, development, and apps that do not need persistence
across restarts.

Do not ship the memory fallback as your production storage strategy if you rely
on:

- persisted unsent event queues
- device and session continuity across app restarts
- long-lived analytics state in storage

## Usage

```ts
import * as amplitude from 'amplitude-rn-analytics';

amplitude.init(API_KEY);
amplitude.track('Button Clicked');
```

## Custom storage provider

For production apps, pass a custom `storageProvider`.

The provider must satisfy the upstream storage contract:

```ts
type Storage<T> = {
  isEnabled(): Promise<boolean>;
  get(key: string): Promise<T | undefined>;
  getRaw(key: string): Promise<string | undefined>;
  set(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  reset(): Promise<void>;
};
```

## Nitro storage example

```ts
import * as amplitude from 'amplitude-rn-analytics';
import { storage, StorageScope } from 'react-native-nitro-storage';

const analyticsStorage = {
  async isEnabled() {
    return true;
  },
  async get(key) {
    const raw = storage.getString(key, StorageScope.Disk);
    return raw ? JSON.parse(raw) : undefined;
  },
  async getRaw(key) {
    return storage.getString(key, StorageScope.Disk) ?? undefined;
  },
  async set(key, value) {
    storage.setString(key, JSON.stringify(value), StorageScope.Disk);
  },
  async remove(key) {
    storage.deleteString(key, StorageScope.Disk);
  },
  async reset() {
    storage.clear(StorageScope.Disk);
  },
};

amplitude.init(API_KEY, undefined, {
  storageProvider: analyticsStorage,
});
```

## Exports

- `InMemoryStorage`
- `MemoryStorage`
- `LocalStorage`

`LocalStorage` remains as a compatibility alias.

`MemoryStorage` and `InMemoryStorage` are the preferred names for the built-in
shared in-memory storage implementation in this fork.

## Upstream compatibility

The public analytics API stays close to the upstream React Native SDK. The
main behavioral difference is the default storage backend: this fork defaults
to memory instead of AsyncStorage.

## Fork lineage

- upstream base: `@amplitude/analytics-react-native@1.5.52`
- fork release: `amplitude-rn-analytics@1.5.54`

## Validation matrix

| Surface | Verified |
| --- | --- |
| Upstream analytics API shape | close to `@amplitude/analytics-react-native@1.5.52` |
| Package build | `bob build` |
| TypeScript | `tsc -p ./tsconfig.json --noEmit` |
| Built-in memory storage | regression tests |
| Custom `storageProvider` | regression tests |
| Init recovery after failed startup | regression tests |
| Native context fallback | regression tests |
