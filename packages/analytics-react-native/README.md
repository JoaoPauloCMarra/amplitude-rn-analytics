# amplitude-rn-analytics

Storage-agnostic React Native analytics SDK compatible with Amplitude services.

This package is a focused fork of `@amplitude/analytics-react-native`. It keeps
the upstream analytics API shape, but removes the required
`@react-native-async-storage/async-storage` dependency and lets apps choose the
storage backend that fits their runtime.

## Install

```sh
npm install amplitude-rn-analytics
```

## Improvements over the original package

- No required AsyncStorage dependency.
- Built-in shared memory storage fallback.
- Custom persistent storage through the upstream `storageProvider` option.
- `MemoryStorage` and `InMemoryStorage` exports for explicit memory-backed use.
- `LocalStorage` retained as a compatibility alias for the memory fallback.
- `shutdown()` API for listener, timer, queue, timeline, and connector cleanup.
- Safer failed-init cleanup so startup errors do not leave stale AppState
  listeners behind.
- Safer legacy event migration that removes old native events only after the new
  event storage write succeeds.
- Native context collection and legacy database migration support retained from
  the original React Native SDK.

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

`MemoryStorage` and `InMemoryStorage` are the preferred names for the built-in
shared in-memory storage implementation in this fork. `LocalStorage` remains as
a compatibility alias.

## Lifecycle cleanup

Call `shutdown()` when a client instance is no longer needed, especially in
tests, hot-reload flows, or host apps that create and dispose multiple
instances.

```ts
import { createInstance } from 'amplitude-rn-analytics';

const analytics = createInstance();

await analytics.init(API_KEY).promise;
analytics.track('Screen Viewed');
analytics.shutdown();
```

## Upstream compatibility

The public analytics API stays close to the upstream React Native SDK. The main
behavioral difference is the default storage backend: this fork defaults to
memory instead of AsyncStorage.

## Fork lineage

- upstream base: `@amplitude/analytics-react-native@1.5.52`
- fork release: `amplitude-rn-analytics@1.5.57`

## Validation matrix

| Surface | Verified |
| --- | --- |
| Upstream analytics API shape | close to `@amplitude/analytics-react-native@1.5.52` |
| Package build | `bob build` |
| TypeScript | `tsc -p ./tsconfig.json --noEmit` |
| Built-in memory storage | regression tests |
| Custom `storageProvider` | regression tests |
| Init recovery after failed startup | regression tests |
| Lifecycle shutdown cleanup | regression tests |
| Legacy event migration safety | regression tests |
| Native context fallback | regression tests |
