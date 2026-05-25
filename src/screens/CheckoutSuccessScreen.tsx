import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { resolveAssetUrl } from '../app/api/client';
import { IMG, ROUTES } from '../utils';
import { formatPrice } from '../utils/format';
import { navigateToTab } from '../utils/navigation';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPO } from '../utils/theme';

export type CheckoutSuccessParams = {
  orderId?: number;
  orderNumber?: string;
  totalPrice?: string;
  paymentMethod?: string;
  orderStatus?: string;
  quantity?: number;
  products?: Array<{ id: number; name: string; image: string | null }>;
};

const CheckoutSuccessScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = (route.params ?? {}) as CheckoutSuccessParams;
  const { orderId, orderNumber, totalPrice, paymentMethod, orderStatus, quantity, products } = params;

  const viewOrder = () => {
    if (orderId) {
      navigation.reset({
        index: 1,
        routes: [
          { name: ROUTES.MAIN_TABS },
          { name: ROUTES.ORDER_DETAIL, params: { orderId } },
        ],
      });
      return;
    }
    navigation.navigate(ROUTES.ORDERS);
  };

  const previewProducts = products?.slice(0, 3) ?? [];
  const extraCount =
    quantity != null && previewProducts.length > 0 ? Math.max(0, quantity - previewProducts.length) : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: SPACING.lg,
          paddingBottom: SPACING.xxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: RADIUS.xl,
            padding: SPACING.lg,
            ...SHADOWS.lg,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: SPACING.lg }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: COLORS.primaryLight,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="checkmark-circle" size={44} color={COLORS.primary} />
            </View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                letterSpacing: 0.8,
                color: COLORS.primary,
                marginTop: SPACING.md,
              }}
            >
              ORDER CONFIRMED
            </Text>
            <Text style={{ ...TYPO.title, color: COLORS.text, marginTop: 6, textAlign: 'center' }}>
              Thank you for your order
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: COLORS.textSecondary,
                marginTop: SPACING.sm,
                textAlign: 'center',
                lineHeight: 22,
                paddingHorizontal: SPACING.sm,
              }}
            >
              We&apos;ve received your order. You can review details and track status anytime.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: COLORS.primaryLight,
              borderRadius: RADIUS.lg,
              padding: SPACING.md,
              borderWidth: 1,
              borderColor: '#d4e0f5',
              marginBottom: SPACING.lg,
            }}
          >
            {orderNumber ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' }}>Order number</Text>
                <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.text }}>#{orderNumber}</Text>
              </View>
            ) : null}

            {totalPrice ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: orderNumber ? SPACING.sm : 0,
                }}
              >
                <Text style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' }}>Total paid</Text>
                <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.primary }}>
                  {formatPrice(totalPrice)}
                </Text>
              </View>
            ) : null}

            {(paymentMethod || orderStatus) && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: SPACING.sm,
                  marginTop: SPACING.md,
                }}
              >
                {paymentMethod ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: COLORS.white,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: RADIUS.full,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                    }}
                  >
                    <Icon name="card-outline" size={14} color={COLORS.primary} style={{ marginRight: 4 }} />
                    <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.text }}>{paymentMethod}</Text>
                  </View>
                ) : null}
                {orderStatus ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: COLORS.white,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: RADIUS.full,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                    }}
                  >
                    <Icon name="time-outline" size={14} color={COLORS.primary} style={{ marginRight: 4 }} />
                    <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.text }}>{orderStatus}</Text>
                  </View>
                ) : null}
              </View>
            )}

            {previewProducts.length > 0 ? (
              <View style={{ marginTop: SPACING.md, flexDirection: 'row', alignItems: 'center' }}>
                {previewProducts.map((p) => {
                  const uri = resolveAssetUrl(p.image);
                  return (
                    <View
                      key={p.id}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: RADIUS.md,
                        backgroundColor: COLORS.white,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                        marginRight: -10,
                        overflow: 'hidden',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                        source={uri ? { uri } : IMG.SHOESRUS_LOGO}
                        resizeMode="contain"
                        style={{ width: '90%', height: '90%' }}
                      />
                    </View>
                  );
                })}
                {extraCount > 0 ? (
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: RADIUS.md,
                      backgroundColor: COLORS.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 4,
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.white }}>+{extraCount}</Text>
                  </View>
                ) : null}
                {quantity != null ? (
                  <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginLeft: SPACING.md, flex: 1 }}>
                    {quantity} item{quantity === 1 ? '' : 's'}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={viewOrder}
            activeOpacity={0.88}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.primary,
              paddingVertical: 16,
              borderRadius: RADIUS.md,
              marginBottom: SPACING.sm,
            }}
          >
            <Icon name="receipt-outline" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
            <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '700' }}>View order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigateToTab(navigation, ROUTES.HOME)}
            activeOpacity={0.88}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 14,
              borderRadius: RADIUS.md,
              borderWidth: 1,
              borderColor: COLORS.border,
              backgroundColor: COLORS.white,
            }}
          >
            <Icon name="home-outline" size={20} color={COLORS.text} style={{ marginRight: 8 }} />
            <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600' }}>Continue shopping</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckoutSuccessScreen;
