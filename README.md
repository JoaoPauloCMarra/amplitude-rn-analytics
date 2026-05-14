# amplitude-rn-analytics

React Native-focused fork of Amplitude's TypeScript SDK monorepo. The public
package is `amplitude-rn-analytics`, built from
`packages/analytics-react-native`.

This fork tracks the upstream React Native SDK API while removing the hard
dependency on `@react-native-async-storage/async-storage`. Apps can use the
built-in memory fallback for development and tests, or pass their own
`storageProvider` for persistent production storage.

## Package

- package name: `amplitude-rn-analytics`
- package source: `packages/analytics-react-native`
- upstream base: `@amplitude/analytics-react-native@1.5.52`
- fork release: `amplitude-rn-analytics@1.5.57`

## Improvements over the original package

- Removed `@react-native-async-storage/async-storage` as a required dependency.
- Added shared in-memory storage as the default fallback.
- Kept the upstream `storageProvider` hook for custom persistent storage.
- Exported `MemoryStorage` and `InMemoryStorage`, with `LocalStorage` retained
  as a compatibility alias.
- Added `shutdown()` to remove AppState listeners, cancel destination timers,
  clear queues, reset timeline state, and detach connector ownership.
- Hardened initialization cleanup so failed startup attempts do not leave stale
  listeners behind.
- Made legacy event migration safer by removing old native events only after
  writes to the configured event storage succeed.
- Kept native context and legacy database migration support from the original
  React Native SDK.

## Production storage

The memory fallback is useful for tests, development, and apps that do not need
analytics state to survive process restarts. Production apps that need queued
event persistence, device continuity, or session continuity should pass a
persistent `storageProvider`.

One supported production backend is `react-native-nitro-storage`.

## Development

```sh
pnpm install
pnpm build
pnpm docs:check
pnpm test
pnpm test:examples
pnpm lint
```

For package-only checks:

```sh
pnpm --dir packages/analytics-react-native typecheck
pnpm --dir packages/analytics-react-native test
pnpm --dir packages/analytics-react-native build
pnpm --dir packages/analytics-react-native pack:local
```

## Publishing

Publish from the package directory, not the private workspace root:

```sh
cd packages/analytics-react-native
npm publish --access public
```
