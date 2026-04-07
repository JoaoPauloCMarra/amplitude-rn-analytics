# amplitude-rn-analytics

Fork of Amplitude's React Native analytics SDK with no hard dependency on
`@react-native-async-storage/async-storage`.

## Published package

The publishable package lives at:

- `packages/analytics-react-native`

Its package name is:

- `amplitude-rn-analytics`

## What changed

- removed AsyncStorage from package dependencies
- replaced the default storage backend with shared in-memory storage
- kept `storageProvider` so apps can inject persistent storage
- updated package metadata and README for standalone publishing

## Recommended production setup

Use a custom persistent storage provider. For Goodword, the intended backend is
`react-native-nitro-storage`.

## Build and test

```sh
pnpm install
pnpm --filter amplitude-rn-analytics typecheck
pnpm --filter amplitude-rn-analytics test
pnpm --filter amplitude-rn-analytics build
```
