import { Storage, getOldCookieName, CookieStorage } from '@amplitude/analytics-core';
import { decode, parseOldCookies, parseOptOut, parseTime } from '../../src/cookie-migration';
import * as LocalStorageModule from '../../src/storage/local-storage';
import { isWeb } from '../../src/utils/platform';

describe('cookie-migration', () => {
  const API_KEY = 'asdfasdf';
  afterEach(() => {
    // clean up cookies
    document.cookie = `${getOldCookieName(API_KEY)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });

  describe('parseOldCookies', () => {
    test('should return default values', async () => {
      const cookies = await parseOldCookies(API_KEY, { disableCookies: true });
      expect(cookies).toEqual({
        optOut: false,
      });
    });

    test('should handle non-persistent storage', async () => {
      jest.spyOn(LocalStorageModule, 'LocalStorage').mockReturnValueOnce({
        isEnabled: async () => false,
        get: async () => ({}),
        getRaw: async () => '',
        set: async () => undefined,
        remove: async () => undefined,
        reset: async () => undefined,
      });
      const cookies = await parseOldCookies(API_KEY, { disableCookies: true });
      expect(cookies).toEqual({
        optOut: false,
      });
    });

    /*
     * Tested function is only available on web.
     */
    if (isWeb()) {
      test('should remove old cookies', async () => {
        const timestamp = 1650949309508;
        const time = timestamp.toString(32);
        const userId = 'userId';
        const encodedUserId = btoa(unescape(encodeURIComponent(userId)));
        const oldCookieName = getOldCookieName(API_KEY);
        document.cookie = `${oldCookieName}=deviceId.${encodedUserId}..${time}.${time}`;
        const cookies = await parseOldCookies(API_KEY, {
          cookieUpgrade: true,
        });
        expect(cookies).toEqual({
          deviceId: 'deviceId',
          userId: 'userId',
          sessionId: timestamp,
          lastEventTime: timestamp,
          optOut: false,
        });

        const storage: Storage<string> = new CookieStorage<string>();
        const cookies2 = await storage.getRaw(oldCookieName);
        expect(cookies2).toBeUndefined();
      });

      test('should keep old cookies', async () => {
        const timestamp = 1650949309508;
        const time = timestamp.toString(32);
        const userId = 'userId';
        const encodedUserId = btoa(unescape(encodeURIComponent(userId)));
        const oldCookieName = getOldCookieName(API_KEY);
        document.cookie = `${oldCookieName}=deviceId.${encodedUserId}..${time}.${time}`;
        const cookies = await parseOldCookies(API_KEY, {
          cookieUpgrade: false,
        });
        expect(cookies).toEqual({
          deviceId: 'deviceId',
          userId: 'userId',
          sessionId: timestamp,
          lastEventTime: timestamp,
          optOut: false,
        });

        const storage: Storage<string> = new CookieStorage<string>();
        const cookies2 = await storage.getRaw(oldCookieName);
        expect(cookies2).toBe(`deviceId.${encodedUserId}..${time}.${time}`);
      });

      test('should parse false opt-out values correctly', async () => {
        const timestamp = 1650949309508;
        const time = timestamp.toString(32);
        const userId = 'userId';
        const encodedUserId = btoa(unescape(encodeURIComponent(userId)));
        const oldCookieName = getOldCookieName(API_KEY);
        document.cookie = `${oldCookieName}=deviceId.${encodedUserId}.0.${time}.${time}`;

        const cookies = await parseOldCookies(API_KEY, {
          cookieUpgrade: false,
        });

        expect(cookies.optOut).toBe(false);
      });
    }
  });

  describe('parseTime', () => {
    test('should parse time', () => {
      const timestamp = Date.now();
      const base32 = timestamp.toString(32);
      expect(parseTime(base32)).toBe(timestamp);
    });

    test('should handle invalid values', () => {
      expect(parseTime('')).toBe(undefined);
    });
  });

  describe('decode', () => {
    test('should decode value', () => {
      expect(decode('YXNkZg==')).toBe('asdf');
    });

    test('should handle incorrecty encoded value', () => {
      expect(decode('asdf')).toBe(undefined);
    });

    test('should handle undefined input', () => {
      expect(decode(undefined)).toBe(undefined);
    });
  });

  describe('parseOptOut', () => {
    test('should parse truthy values', () => {
      expect(parseOptOut('1')).toBe(true);
      expect(parseOptOut('true')).toBe(true);
    });

    test('should parse falsy values', () => {
      expect(parseOptOut('0')).toBe(false);
      expect(parseOptOut('false')).toBe(false);
      expect(parseOptOut(undefined)).toBe(false);
    });
  });
});
