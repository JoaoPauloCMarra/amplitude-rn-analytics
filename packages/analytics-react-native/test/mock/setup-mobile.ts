import { NativeModules, Platform } from 'react-native';

/*
 * Set the platform OS to mobile.
 */
Platform.OS = 'ios';

/*
 * Mock navigator. This is what the navigator looks like on mobile
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-restricted-globals
window['navigator'] = { product: 'ReactNative' };

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
      deviceBrand: 'react-native-tests',
      deviceManufacturer: 'react-native-tests',
      deviceModel: 'react-native-tests',
      carrier: 'react-native-tests',
    };
  },
  getLegacySessionData: () => ({}),
  getLegacyEvents: () => [],
  removeLegacyEvent: () => ({}),
};
