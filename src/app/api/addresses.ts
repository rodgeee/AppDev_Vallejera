import { apiRequest } from './client';
import type { CustomerAddress } from './types';

export function fetchAddresses(token: string): Promise<CustomerAddress[]> {
  return apiRequest<CustomerAddress[]>('/api/customer/addresses', {
    method: 'GET',
    token,
  });
}

export function fetchAddress(token: string, id: number): Promise<CustomerAddress> {
  return apiRequest<CustomerAddress>(`/api/customer/addresses/${id}`, {
    method: 'GET',
    token,
  });
}

export type AddressPayload = {
  label: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  province?: string | null;
  postalCode?: string | null;
  country?: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  isDefault?: boolean;
};

export function createAddress(token: string, payload: AddressPayload): Promise<CustomerAddress> {
  return apiRequest<CustomerAddress>('/api/customer/addresses', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function updateAddress(
  token: string,
  id: number,
  payload: Partial<AddressPayload>,
): Promise<CustomerAddress> {
  return apiRequest<CustomerAddress>(`/api/customer/addresses/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteAddress(token: string, id: number): Promise<void> {
  return apiRequest<null>(`/api/customer/addresses/${id}`, {
    method: 'DELETE',
    token,
  });
}
