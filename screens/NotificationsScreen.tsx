import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Notifications from '../components/Notifications';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const NotificationsScreen: React.FC<Props > = ({ route }) => {
    const eventsData = route?.params?.eventsData ?? {};

  return (
    <Notifications eventsData={eventsData} />
  );
};

export default NotificationsScreen;