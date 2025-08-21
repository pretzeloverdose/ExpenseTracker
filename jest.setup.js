import '@testing-library/jest-native/extend-expect';

// -----------------------------
// AsyncStorage
// -----------------------------
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)), // no auth method
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// -----------------------------
// Notifee
// -----------------------------
jest.mock('@notifee/react-native', () => {
  const mockNotifee = {
    onForegroundEvent: jest.fn(),
    onBackgroundEvent: jest.fn(),
    requestPermission: jest.fn(() => Promise.resolve({ authorizationStatus: 1 })),
    displayNotification: jest.fn(() => Promise.resolve()),
    createTriggerNotification: jest.fn(() => Promise.resolve()),
    cancelNotification: jest.fn(() => Promise.resolve()),
    cancelAllNotifications: jest.fn(() => Promise.resolve()),
    createChannel: jest.fn(() => Promise.resolve()),
  };

  return {
    __esModule: true,
    default: mockNotifee, // default export
    TriggerType: {
      TIMESTAMP: 0,
      INTERVAL: 1,
    },
    TimestampTrigger: jest.fn(),
    AndroidImportance: {
      HIGH: 4, // now properly exported
      DEFAULT: 3,
      LOW: 2,
      MIN: 1,
      NONE: 0,
    },
  };
});



// -----------------------------
// Reanimated
// -----------------------------
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// -----------------------------
// Gesture Handler
// -----------------------------
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    View,
    Text: View,
  };
});

// -----------------------------
// Vector Icons
// -----------------------------
jest.mock('react-native-vector-icons', () => ({
  Ionicons: 'Icon',
  MaterialIcons: 'Icon',
  FontAwesome: 'Icon',
}));

// -----------------------------
// Safe Area Context
// -----------------------------
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

// -----------------------------
// Patch NativeModules (iOS locale)
// -----------------------------
jest.mock('react-native/Libraries/Settings/Settings', () => ({
  get: () => ({
    AppleLocale: 'en_US',
    AppleLanguages: ['en-US', 'en'],
  }),
}));

// -----------------------------
// WebView
// -----------------------------
jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    WebView: (props) => <View {...props} />,
  };
});

// -----------------------------
// react-native-screens
// -----------------------------
jest.mock('react-native-screens', () => {
  return {
    enableScreens: jest.fn(),
    Screen: require('react-native/Libraries/Components/View/View').View,
    ScreenStack: require('react-native/Libraries/Components/View/View').View,
    ScreenStackHeaderConfig: require('react-native/Libraries/Components/View/View').View,
    ScreenStackHeaderSubview: require('react-native/Libraries/Components/View/View').View,
  };
});

// Native Stack (from react-navigation/native-stack)
jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }) => <>{children}</>,
      Screen: ({ children }) => <>{children}</>,
    }),
  };
});


// -----------------------------
// Clear mocks before each test
// -----------------------------
beforeEach(() => {
  jest.clearAllMocks();
});
