import { apiRequest } from './client';
import type { ServiceBooking } from './types';

export function fetchServiceBookings(token: string): Promise<ServiceBooking[]> {
  return apiRequest<ServiceBooking[]>('/api/customer/service-bookings', {
    method: 'GET',
    token,
    signOutOn401: false,
  });
}

export function createServiceBooking(
  token: string,
  payload: {
    packageName: string;
    shoeName: string;
    material?: string;
    notes?: string;
  },
): Promise<ServiceBooking> {
  return apiRequest<ServiceBooking>('/api/customer/service-bookings', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}
