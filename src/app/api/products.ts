import { apiRequest } from './client';
import type { Product, ProductDetail } from './types';

export function fetchProducts(
  token: string,
  params?: { search?: string; limit?: number },
): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.search) {
    query.set('search', params.search);
  }
  if (params?.limit) {
    query.set('limit', String(params.limit));
  }
  const qs = query.toString();

  return apiRequest<Product[]>(`/api/customer/products${qs ? `?${qs}` : ''}`, {
    method: 'GET',
    token,
    signOutOn401: false,
  });
}

export function fetchProduct(token: string, id: number): Promise<ProductDetail> {
  return apiRequest<ProductDetail>(`/api/customer/products/${id}`, {
    method: 'GET',
    token,
  });
}
