import type { CartLine } from '../types/cart';
import type { Product } from '../api/types';
import { getProductPrimaryUri } from '../../utils/productImages';

export const CART_ADD = 'CART_ADD';
export const CART_UPDATE_QTY = 'CART_UPDATE_QTY';
export const CART_REMOVE = 'CART_REMOVE';
export const CART_REMOVE_MANY = 'CART_REMOVE_MANY';
export const CART_CLEAR = 'CART_CLEAR';

type CartState = { lines: CartLine[] };

const INITIAL: CartState = { lines: [] };

export function cartLineKey(productId: number, size: string): string {
  return `${productId}:${size}`;
}

export const cartAdd = (product: Product, quantity = 1, selectedSize?: string) => ({
  type: CART_ADD as typeof CART_ADD,
  payload: { product, quantity, selectedSize },
});

export const cartUpdateQty = (lineKey: string, quantity: number) => ({
  type: CART_UPDATE_QTY as typeof CART_UPDATE_QTY,
  payload: { lineKey, quantity },
});

export const cartRemove = (lineKey: string) => ({
  type: CART_REMOVE as typeof CART_REMOVE,
  payload: { lineKey },
});

export const cartRemoveMany = (lineKeys: string[]) => ({
  type: CART_REMOVE_MANY as typeof CART_REMOVE_MANY,
  payload: { lineKeys },
});

export const cartClear = () => ({ type: CART_CLEAR as typeof CART_CLEAR });

function lineFromProduct(product: Product, quantity: number, size: string): CartLine {
  return {
    lineKey: cartLineKey(product.id, size),
    productId: product.id,
    productName: product.name,
    color: product.color,
    size,
    quantity,
    unitPrice: product.price,
    image: product.image,
    imageUrl: getProductPrimaryUri(product),
    availableStock: product.availableStock,
  };
}

export function cartLineSubtotal(line: CartLine): number {
  const price = parseFloat(line.unitPrice);
  return (Number.isFinite(price) ? price : 0) * line.quantity;
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + cartLineSubtotal(line), 0);
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

function withLineKeys(state: CartState): CartState {
  return {
    lines: state.lines.map((l) => ({
      ...l,
      lineKey: l.lineKey ?? cartLineKey(l.productId, l.size),
      imageUrl: l.imageUrl ?? getProductPrimaryUri({ image: l.image, images: [] }),
    })),
  };
}

export default function cartReducer(state = INITIAL, action: any): CartState {
  const base = withLineKeys(state);
  switch (action.type) {
    case CART_ADD: {
      const { product, quantity, selectedSize } = action.payload as {
        product: Product;
        quantity: number;
        selectedSize?: string;
      };
      const size = (selectedSize ?? product.size).trim();
      const addQty = Math.max(1, quantity);
      const key = cartLineKey(product.id, size);
      const existing = base.lines.find((l) => l.lineKey === key);
      if (existing) {
        const nextQty = Math.min(existing.quantity + addQty, product.availableStock);
        return {
          lines: base.lines.map((l) =>
            l.lineKey === key
              ? {
                  ...l,
                  quantity: nextQty,
                  availableStock: product.availableStock,
                  image: product.image,
                  imageUrl: getProductPrimaryUri(product),
                }
              : l,
          ),
        };
      }
      if (product.availableStock <= 0) {
        return base;
      }
      return {
        lines: [
          ...base.lines,
          lineFromProduct(product, Math.min(addQty, product.availableStock), size),
        ],
      };
    }
    case CART_UPDATE_QTY: {
      const { lineKey, quantity } = action.payload as { lineKey: string; quantity: number };
      if (quantity <= 0) {
        return { lines: base.lines.filter((l) => l.lineKey !== lineKey) };
      }
      return {
        lines: base.lines.map((l) =>
          l.lineKey === lineKey
            ? { ...l, quantity: Math.min(quantity, l.availableStock) }
            : l,
        ),
      };
    }
    case CART_REMOVE:
      return {
        lines: base.lines.filter((l) => l.lineKey !== action.payload.lineKey),
      };
    case CART_REMOVE_MANY: {
      const keys = new Set((action.payload.lineKeys as string[]) ?? []);
      return {
        lines: base.lines.filter((l) => !keys.has(l.lineKey)),
      };
    }
    case CART_CLEAR:
      return INITIAL;
    default:
      return base;
  }
}
