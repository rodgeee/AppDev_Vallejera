import { apiRequest } from './client';
import type { CustomerProfile } from './types';

export function fetchProfile(token: string): Promise<CustomerProfile> {
  return apiRequest<CustomerProfile>('/api/customer/profile', {
    method: 'GET',
    token,
    signOutOn401: false,
  });
}

export function updateProfile(
  token: string,
  payload: Partial<Pick<CustomerProfile, 'fullName' | 'email' | 'phoneNumber' | 'shoeSize'>>,
): Promise<CustomerProfile> {
  return apiRequest<CustomerProfile>('/api/customer/profile', {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}
