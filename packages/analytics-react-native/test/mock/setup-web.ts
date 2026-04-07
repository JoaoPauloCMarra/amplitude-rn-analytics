import { Platform } from 'react-native';

/*
 * Set the platform OS to mobile.
 */
Platform.OS = 'web';

/*
 * Mock navigator. This is what the navigator looks like on mobile
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// window['navigator'] = { product: "ReactNative" }
