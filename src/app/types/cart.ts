export type CartLine = {
  lineKey: string;
  productId: number;
  productName: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: string;
  image: string | null;
  imageUrl: string | null;
  availableStock: number;
};

export const PAYMENT_METHODS = ['COD'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
