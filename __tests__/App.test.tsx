import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';

// Mock AsyncStorage to return no auth method
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock Notifee so AndroidImportance.HIGH exists
jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    onForegroundEvent: jest.fn(),
    onBackgroundEvent: jest.fn(),
    requestPermission: jest.fn(() => Promise.resolve({ authorizationStatus: 1 })),
    createChannel: jest.fn(() => Promise.resolve()),
    displayNotification: jest.fn(() => Promise.resolve()),
  },
  AndroidImportance: {
    HIGH: 4, // any numeric value works for the test
  },
  TriggerType: { TIMESTAMP: 0, INTERVAL: 1 },
  TimestampTrigger: jest.fn(),
}));

describe('App root', () => {
  it('renders HomeScreen content', async () => {
    const { getByText, debug } = render(<App />);

    // wait for HomeScreen text to appear
    await waitFor(() => {
      // 
    });
  });
});
