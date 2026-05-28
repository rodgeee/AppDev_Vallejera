import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchAddresses } from '../app/api/addresses';
import { createOrder } from '../app/api/orders';
import type { CustomerAddress } from '../app/api/types';
import { PAYMENT_METHODS, type PaymentMethod } from '../app/types/cart';
import { useAuthToken } from '../app/hooks/useAuthToken';
import { useAppAlert } from '../app/context/AppAlertContext';
import { useCart } from '../app/hooks/useCart';
import { displayOrderSuccessNotification } from '../app/services/pushNotifications';
import { cartTotal } from '../app/reducers/cart';
import CustomButton from '../Components/CustomButton';
import ErrorState from '../Components/ErrorState';
import { ROUTES } from '../utils';
import { formatPrice } from '../utils/format';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../utils/theme';

const CheckoutScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const checkoutLineKeys = route.params?.lineKeys as string[] | undefined;
  const token = useAuthToken();
  const { alert } = useAppAlert();
  const { lines, removeMany } = useCart();

  const checkoutLines = useMemo(() => {
    if (!checkoutLineKeys?.length) {
      return lines;
    }
    const keySet = new Set(checkoutLineKeys);
    return lines.filter((l) => keySet.has(l.lineKey));
  }, [lines, checkoutLineKeys]);

  const checkoutTotal = useMemo(() => cartTotal(checkoutLines), [checkoutLines]);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [orderNotes, setOrderNotes] = useState('');

  const load = useCallback(async () => {
    if (!token) {
      setError('Not signed in.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAddresses(token);
      setAddresses(list);
      const defaultAddr = list.find((a) => a.isDefault) ?? list[0];
      setAddressId(defaultAddr?.id ?? null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load addresses.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (checkoutLines.length === 0) {
      navigation.replace(ROUTES.CART);
    }
  }, [checkoutLines.length, navigation]);

  const placeOrder = async () => {
    if (!token || !addressId) {
      alert('Address required', 'Add a shipping address before checkout.');
      return;
    }
    setSubmitting(true);
    try {
      const order = await createOrder(token, {
        paymentMethod,
        addressId,
        items: checkoutLines.map((l) => ({
          productId: l.productId,
          quantity: l.quantity,
          size: l.size,
        })),
        orderNotes: orderNotes.trim() || undefined,
      });
      displayOrderSuccessNotification(order.orderNumber).catch((error: unknown) => {
        if (__DEV__) {
          console.warn('Failed to display order success notification:', error);
        }
      });
      removeMany(checkoutLines.map((l) => l.lineKey));
      navigation.replace(ROUTES.CHECKOUT_SUCCESS, {
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        orderStatus: order.orderStatus,
        quantity: order.quantity,
        products: order.products.map((p) => ({
          id: p.id,
          name: p.name,
          image: p.image,
        })),
      });
    } catch (e: unknown) {
      alert('Checkout failed', e instanceof Error ? e.message : 'Could not place order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardBackground }}>
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: SPACING.xxl }} />
      </SafeAreaView>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardBackground }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: SPACING.md, paddingBottom: SPACING.xxl }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md }}>
          Ship to
        </Text>
        {addresses.length === 0 ? (
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: RADIUS.md,
              padding: SPACING.md,
              marginBottom: SPACING.lg,
              ...SHADOWS.sm,
            }}
          >
            <Text style={{ color: COLORS.textMuted, marginBottom: SPACING.md }}>
              No saved addresses yet.
            </Text>
            <CustomButton
              label="Add address"
              mainStyle={{ width: '100%' }}
              onPress={() =>
                navigation.navigate(ROUTES.ADDRESS_FORM, { onSaved: () => load() })
              }
            />
          </View>
        ) : (
          addresses.map((addr) => (
            <TouchableOpacity
              key={addr.id}
              onPress={() => setAddressId(addr.id)}
              style={{
                backgroundColor: COLORS.white,
                borderRadius: RADIUS.md,
                padding: SPACING.md,
                marginBottom: SPACING.sm,
                borderWidth: 2,
                borderColor: addressId === addr.id ? COLORS.primary : COLORS.border,
                ...SHADOWS.sm,
              }}
            >
              <Text style={{ fontWeight: '700', color: COLORS.text }}>{addr.label}</Text>
              <Text style={{ fontSize: 13, color: COLORS.text, marginTop: 4 }}>{addr.displayLine1}</Text>
              {addr.displayLine2 ? (
                <Text style={{ fontSize: 12, color: COLORS.textMuted }}>{addr.displayLine2}</Text>
              ) : null}
            </TouchableOpacity>
          ))
        )}
        {addresses.length > 0 ? (
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.ADDRESS_FORM, { onSaved: () => load() })}
            style={{ marginBottom: SPACING.lg }}
          >
            <Text style={{ color: COLORS.primary, fontWeight: '600' }}>+ Add new address</Text>
          </TouchableOpacity>
        ) : null}

        <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md }}>
          Payment method
        </Text>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: RADIUS.md,
            padding: SPACING.md,
            marginBottom: SPACING.sm,
            borderWidth: 2,
            borderColor: COLORS.primary,
          }}
        >
          <Text style={{ fontWeight: '600', color: COLORS.text }}>{paymentMethod}</Text>
          <Text style={{ marginTop: 4, fontSize: 12, color: COLORS.textMuted }}>
            Cash on Delivery only.
          </Text>
        </View>

        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: COLORS.text,
            marginTop: SPACING.lg,
            marginBottom: SPACING.sm,
          }}
        >
          Order notes (optional)
        </Text>
        <TextInput
          value={orderNotes}
          onChangeText={setOrderNotes}
          placeholder="Delivery instructions…"
          placeholderTextColor={COLORS.placeholder}
          multiline
          style={{
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: RADIUS.sm,
            padding: SPACING.md,
            minHeight: 80,
            fontSize: 14,
            color: COLORS.text,
            textAlignVertical: 'top',
          }}
        />

        <View
          style={{
            marginTop: SPACING.xl,
            backgroundColor: COLORS.white,
            borderRadius: RADIUS.md,
            padding: SPACING.md,
            ...SHADOWS.sm,
          }}
        >
          <Text style={{ fontWeight: '700', marginBottom: SPACING.sm }}>Order summary</Text>
          {checkoutLines.map((l) => (
            <View
              key={l.lineKey}
              style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}
            >
              <Text style={{ flex: 1, fontSize: 13, color: COLORS.text }} numberOfLines={1}>
                {l.productName} × {l.quantity}
              </Text>
            </View>
          ))}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: SPACING.md,
              paddingTop: SPACING.md,
              borderTopWidth: 1,
              borderTopColor: COLORS.border,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700' }}>Total</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.primary }}>
              {formatPrice(checkoutTotal)}
            </Text>
          </View>
        </View>

        <CustomButton
          label={submitting ? 'Placing order…' : 'Place order'}
          mainStyle={{ marginTop: SPACING.xl, width: '100%', opacity: submitting ? 0.7 : 1 }}
          disabled={submitting || !addressId}
          onPress={placeOrder}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckoutScreen;
