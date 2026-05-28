import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

const ORDER_UPDATES_CHANNEL_ID = 'order-updates';

let channelReady = false;

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android' || channelReady) {
    return;
  }
  await notifee.createChannel({
    id: ORDER_UPDATES_CHANNEL_ID,
    name: 'Order updates',
    importance: AndroidImportance.HIGH,
  });
  channelReady = true;
}

export async function displayOrderSuccessNotification(orderNumber?: string): Promise<void> {
  await ensureAndroidChannel();
  await notifee.displayNotification({
    title: 'Order placed successfully',
    body: orderNumber
      ? `Your order ${orderNumber} was received and is now being processed.`
      : 'Your order was received and is now being processed.',
    android: {
      channelId: ORDER_UPDATES_CHANNEL_ID,
      // High importance channel enables heads-up banner on supported devices.
      pressAction: { id: 'default' },
    },
  });
}

export async function displayOrderStatusUpdateNotification(
  orderNumber: string,
  orderStatus: string,
): Promise<void> {
  await ensureAndroidChannel();
  await notifee.displayNotification({
    title: 'Order status updated',
    body: `${orderNumber} is now ${orderStatus}.`,
    android: {
      channelId: ORDER_UPDATES_CHANNEL_ID,
      pressAction: { id: 'default' },
    },
  });
}

export async function requestLocalNotificationPermission(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  await notifee.requestPermission();
}
