import { useState, useEffect, useRef } from 'react';
import { Platform , Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../contexts/auth/AuthState';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

function PushNotification() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<any>(false);
  const { setdeviceId } = useAuth()
  const notificationListener = useRef();
  const responseListener = useRef();

  async function registerForPushNotificationsAsync() {
    let token = '';
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C'
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return token;
      }
      token = (await Notifications.getDevicePushTokenAsync()).data;
      console.log(token,"token");
      /* setdeviceId(token) */
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    }) as any;

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    }) as any;

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current as any);
      Notifications.removeNotificationSubscription(responseListener.current as any);
    };
  }, []);

  return <></>;
}

/* async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! ",
      body: 'Here is the notification body',
      data: { data: 'goes here' }
    },
    trigger: { seconds: 2 }
  });
} */


export default PushNotification;
