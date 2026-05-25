import React, { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetchOrders } from '../app/api/orders';
import type { OrderSummary } from '../app/api/types';
import { useAuthToken } from '../app/hooks/useAuthToken';
import ErrorState from '../Components/ErrorState';
import LoadingState from '../Components/LoadingState';
import { ROUTES } from '../utils';
import { formatDate, formatPrice } from '../utils/format';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../utils/theme';

const OrdersScreen = () => {
  const navigation = useNavigation<any>();
  const token = useAuthToken();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setError('Not signed in.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setOrders(await fetchOrders(token));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading && orders.length === 0) {
    return <LoadingState message="Loading orders…" />;
  }

  if (error && orders.length === 0) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardBackground }} edges={['bottom']}>
      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: SPACING.md, gap: SPACING.md }}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: COLORS.textMuted, marginTop: SPACING.xl }}>
            No orders yet.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: item.id })}
            style={{
              backgroundColor: COLORS.white,
              borderRadius: RADIUS.md,
              padding: SPACING.md,
              ...SHADOWS.sm,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.text }}>
              {item.orderNumber}
            </Text>
            <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
              {formatDate(item.dateCreated)} · {item.orderStatus}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.primary, marginTop: SPACING.sm }}>
              {formatPrice(item.totalPrice)} · {item.paymentMethod}
            </Text>
            {item.trackingNumber ? (
              <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>
                Tracking: {item.trackingNumber}
              </Text>
            ) : null}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default OrdersScreen;
