/** Order statuses that allow customer cancellation (matches srusystem Orders entity). */
export const CANCELLABLE_ORDER_STATUSES = ['Pending', 'Processing'] as const;

export function canCancelOrder(orderStatus: string | null | undefined): boolean {
  if (!orderStatus) {
    return false;
  }
  const normalized = orderStatus.trim().toLowerCase();
  return CANCELLABLE_ORDER_STATUSES.some((s) => s.toLowerCase() === normalized);
}

export function orderStatusLabel(orderStatus: string): string {
  return orderStatus.trim();
}
