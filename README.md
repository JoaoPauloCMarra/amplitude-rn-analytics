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

## Fork lineage

- upstream base: `@amplitude/analytics-react-native@1.5.52`
- fork release: `amplitude-rn-analytics@1.5.55`

## Build and test

```sh
npm install --prefix packages/analytics-react-native
npm run --prefix packages/analytics-react-native typecheck
npm run --prefix packages/analytics-react-native test
npm run --prefix packages/analytics-react-native build
npm run --prefix packages/analytics-react-native pack:local
```
