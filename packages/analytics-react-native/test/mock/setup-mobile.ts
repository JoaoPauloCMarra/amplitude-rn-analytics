import { NativeModules, Platform } from 'react-native';

/*
 * Set the platform OS to mobile.
 */
Platform.OS = 'ios';

/*
 * Mock navigator. This is what the navigator looks like on mobile
 */
// eslint-disable-next-line no-restricted-globals
Object.defineProperty(globalThis, 'navigator', {
  value: { product: 'ReactNative' },
  configurable: true,
  writable: true,
});

/*
 * Mock Native Module
 */
NativeModules.AmplitudeReactNative = {
  getApplicationContext: async (): Promise<Record<string, string>> => {
    return {
      version: '1.0.0',
      platform: 'iOS',
      osName: 'iOS',
      osVersion: 'react-native-tests',
      language: 'react-native-tests',
      country: 'react-native-tests',
      deviceBrand: 'react-native-tests',
      deviceManufacturer: 'react-native-tests',
      deviceModel: 'react-native-tests',
      carrier: 'react-native-tests',
      adid: 'react-native-tests',
      appSetId: 'react-native-tests',
      idfv: 'react-native-tests',
    };
  },
  getLegacySessionData: () => ({}),
  getLegacyEvents: () => [],
  removeLegacyEvent: () => ({}),
};
