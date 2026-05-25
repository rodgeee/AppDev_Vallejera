import { apiRequest } from './client';
import type { OrderDetail, OrderSummary } from './types';

export function fetchOrders(token: string): Promise<OrderSummary[]> {
  return apiRequest<OrderSummary[]>('/api/customer/orders', {
    method: 'GET',
    token,
  });
}

export function fetchOrder(token: string, id: number): Promise<OrderDetail> {
  return apiRequest<OrderDetail>(`/api/customer/orders/${id}`, {
    method: 'GET',
    token,
  });
}

export function createOrder(
  token: string,
  payload: {
    paymentMethod: string;
    addressId: number;
    items: Array<{ productId: number; quantity: number; size?: string }>;
    orderNotes?: string;
  },
): Promise<OrderDetail> {
  return apiRequest<OrderDetail>('/api/customer/orders', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function cancelOrder(token: string, orderId: number): Promise<OrderDetail> {
  return apiRequest<OrderDetail>(`/api/customer/orders/${orderId}/cancel`, {
    method: 'POST',
    token,
  });
}
