import { apiRequest } from './client';

export type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  middleName?: string;
  phoneNumber?: string;
  shoeSize?: string;
};

export type SignupResult = {
  message: string;
  verificationUrl?: string | null;
  /** Present when the server can issue a JWT immediately after signup. */
  token?: string | null;
};

export function registerCustomer(payload: SignupPayload): Promise<SignupResult> {
  return apiRequest<SignupResult>('/api/customer/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
