import { useDispatch, useSelector } from 'react-redux';
import type { Product } from '../api/types';
import {
  cartAdd,
  cartClear,
  cartItemCount,
  cartRemove,
  cartRemoveMany,
  cartTotal,
  cartUpdateQty,
} from '../reducers/cart';
import type { CartLine } from '../types/cart';

type RootState = { cart: { lines: CartLine[] } };

export function useCart() {
  const dispatch = useDispatch();
  const lines = useSelector((s: RootState) => s.cart?.lines ?? []);

  return {
    lines,
    itemCount: cartItemCount(lines),
    total: cartTotal(lines),
    add: (product: Product, quantity?: number, selectedSize?: string) =>
      dispatch(cartAdd(product, quantity, selectedSize)),
    updateQty: (lineKey: string, quantity: number) => dispatch(cartUpdateQty(lineKey, quantity)),
    remove: (lineKey: string) => dispatch(cartRemove(lineKey)),
    removeMany: (lineKeys: string[]) => dispatch(cartRemoveMany(lineKeys)),
    clear: () => dispatch(cartClear()),
  };
}
