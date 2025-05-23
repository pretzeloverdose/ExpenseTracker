import { Alert } from 'react-native';

/**
 * Prompts the user with a confirm dialog. Returns a promise that resolves to true if confirmed.
 */
export const confirmDelete = (): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Delete', style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true }
    );
  });
};
