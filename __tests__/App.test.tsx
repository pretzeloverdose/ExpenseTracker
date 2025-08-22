import { render, waitFor, screen } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../App';
import { act, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock notifee so it doesn’t blow up
jest.mock('@notifee/react-native', () => ({
  requestPermission: jest.fn().mockResolvedValue({ authorizationStatus: 1 }),
  createChannel: jest.fn().mockResolvedValue('channel-id'),
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading indicator initially', () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep loading state
    );
    
    const { getByTestId } = render(<App />);
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('hides ActivityIndicator when isLoading is false', async () => {
    // AsyncStorage resolves quickly
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const { queryByTestId, UNSAFE_getByType  } = render(<App />);

    // Initially should show loader
    expect(queryByTestId('activity-indicator')).toBeTruthy();

    // Wait until loader disappears
    await waitFor(() => {
      expect(queryByTestId('activity-indicator')).toBeNull();
    });

    expect(UNSAFE_getByType(NavigationContainer)).toBeTruthy();

    screen.debug();

  });

  it('shows auth modal when auth required', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('pin');
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-modal')).toBeTruthy();
    });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('fingerprint');
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-modal')).toBeTruthy();
    });

  });
});