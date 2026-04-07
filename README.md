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
- fork release: `amplitude-rn-analytics@1.5.53`

## Build and test

```sh
cd packages/analytics-react-native
npm install
npm run typecheck
npm run test
npm run build
```
