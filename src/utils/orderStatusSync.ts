import type { OrderSummary } from '../app/api/types';
import { displayOrderStatusUpdateNotification } from '../app/services/pushNotifications';

/** Tracks last-known statuses and notifies when admin (or server) changes an order. */
export function syncOrderStatusSnapshots(
  orders: OrderSummary[],
  previousById: Map<number, string>,
): Map<number, string> {
  const next = new Map<number, string>();

  for (const order of orders) {
    const status = order.orderStatus.trim();
    next.set(order.id, status);

    const previous = previousById.get(order.id);
    if (previous && previous !== status) {
      void displayOrderStatusUpdateNotification(order.orderNumber, status);
    }
  }

  return next;
}
