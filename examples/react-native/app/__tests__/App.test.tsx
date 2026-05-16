/**
 * @format
 */

jest.mock('amplitude-rn-analytics', () => ({
  init: jest.fn(() => ({promise: Promise.resolve({message: 'mocked'})})),
  track: jest.fn(() => ({promise: Promise.resolve({message: 'mocked'})})),
  identify: jest.fn(() => ({promise: Promise.resolve({message: 'mocked'})})),
  Identify: jest
    .fn()
    .mockImplementation(() => ({set: jest.fn().mockReturnThis()})),
  Types: {
    LogLevel: {
      Verbose: 4,
    },
  },
}));

import 'react-native';
import React from 'react';
import App from '../App';

import {it} from '@jest/globals';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});
