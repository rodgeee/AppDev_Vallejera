import React, { useCallback, useRef, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { cancelOrder, fetchOrder } from '../app/api/orders';
import { resolveAssetUrl } from '../app/api/client';
import type { OrderDetail } from '../app/api/types';
import { useFocusPolling } from '../app/hooks/useFocusPolling';
import { useAuthToken } from '../app/hooks/useAuthToken';
import { displayOrderStatusUpdateNotification } from '../app/services/pushNotifications';
import { useAppAlert } from '../app/context/AppAlertContext';
import CustomButton from '../Components/CustomButton';
import ErrorState from '../Components/ErrorState';
import LoadingState from '../Components/LoadingState';
import { IMG } from '../utils';
import { formatDate, formatPrice } from '../utils/format';
import { canCancelOrder } from '../utils/orders';
import { COLORS, RADIUS, SPACING } from '../utils/theme';

const OrderDetailScreen = () => {
  const route = useRoute<any>();
  const orderId = Number(route.params?.orderId);
  const token = useAuthToken();
  const { alert } = useAppAlert();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastStatusRef = useRef<string | null>(null);
  const hasOrderRef = useRef(false);
  hasOrderRef.current = order !== null;

  const load = useCallback(
    async (silent = false) => {
      if (!token || !orderId) {
        setError('Invalid order.');
        setLoading(false);
        return;
      }
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      try {
        const next = await fetchOrder(token, orderId);
        const previousStatus = lastStatusRef.current;
        const nextStatus = next.orderStatus.trim();
        if (previousStatus && previousStatus !== nextStatus) {
          void displayOrderStatusUpdateNotification(next.orderNumber, nextStatus);
        }
        lastStatusRef.current = nextStatus;
        setOrder(next);
      } catch (e: unknown) {
        if (!silent) {
          setError(e instanceof Error ? e.message : 'Failed to load order.');
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [token, orderId],
  );

  useFocusPolling(() => load(hasOrderRef.current), { enabled: Boolean(token && orderId) });

  const confirmCancel = () => {
    if (!order || !token) {
      return;
    }
    alert(
      'Cancel order?',
      `Cancel ${order.orderNumber}? This cannot be undone. Stock will be released back to the shop.`,
      [
        { text: 'Keep order', style: 'cancel' },
        {
          text: 'Cancel order',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              setOrder(await cancelOrder(token, orderId));
            } catch (e: unknown) {
              alert(
                'Could not cancel',
                e instanceof Error ? e.message : 'Please try again.',
              );
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return <LoadingState message="Loading order…" />;
  }

  if (error || !order) {
    return <ErrorState message={error || 'Order not found.'} onRetry={() => load(false)} />;
  }

  const cancellable = canCancelOrder(order.orderStatus);
  const isCancelled = order.orderStatus.toLowerCase() === 'cancelled';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, paddingBottom: SPACING.xxl, gap: SPACING.lg }}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.text }}>{order.orderNumber}</Text>
          <View
            style={{
              alignSelf: 'flex-start',
              marginTop: SPACING.sm,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: RADIUS.full,
              backgroundColor: isCancelled ? COLORS.errorBg : COLORS.primaryLight,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: isCancelled ? COLORS.errorText : COLORS.primary,
              }}
            >
              {order.orderStatus}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.sm }}>
            {formatDate(order.dateCreated)}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.primary, marginTop: SPACING.sm }}>
            {formatPrice(order.totalPrice)} · {order.paymentMethod}
          </Text>
          {order.trackingNumber ? (
            <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: SPACING.sm }}>
              Tracking: {order.trackingNumber}
            </Text>
          ) : null}
        </View>

        <View style={{ gap: SPACING.sm }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text }}>Items</Text>
          {order.products.map((p) => {
            const uri =
              (typeof p.imageUrl === 'string' && p.imageUrl !== '' ? p.imageUrl : null) ||
              resolveAssetUrl(p.image);
            return (
              <View
                key={p.id}
                style={{
                  flexDirection: 'row',
                  gap: SPACING.md,
                  alignItems: 'center',
                  backgroundColor: COLORS.cardBackground,
                  borderRadius: RADIUS.md,
                  padding: SPACING.sm,
                }}
              >
                <Image
                  source={uri ? { uri } : IMG.SHOESRUS_LOGO}
                  style={{ width: 56, height: 56, borderRadius: RADIUS.sm }}
                  resizeMode="contain"
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', color: COLORS.text }}>{p.name}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
                    {p.color} · {p.size}
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.primary, marginTop: 2 }}>
                    {formatPrice(p.price)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {cancellable ? (
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: RADIUS.lg,
              padding: SPACING.md,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 20, marginBottom: SPACING.md }}>
              You can cancel while this order is still pending or being processed. Once it ships, cancellation
              is no longer available in the app.
            </Text>
            <CustomButton
              label={cancelling ? 'Cancelling…' : 'Cancel order'}
              mainStyle={{
                width: '100%',
                backgroundColor: COLORS.white,
                borderWidth: 1,
                borderColor: COLORS.errorBorder,
                opacity: cancelling ? 0.7 : 1,
              }}
              textStyle={{ color: COLORS.errorText, fontWeight: '700' }}
              disabled={cancelling}
              onPress={confirmCancel}
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailScreen;
