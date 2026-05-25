import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { resolveAssetUrl } from '../app/api/client';
import { useCart } from '../app/hooks/useCart';
import { cartLineSubtotal, cartTotal } from '../app/reducers/cart';
import CustomButton from '../Components/CustomButton';
import { ROUTES, IMG } from '../utils';
import { formatPrice } from '../utils/format';
import { COLORS, RADIUS, SPACING, TYPO } from '../utils/theme';

const CartScreen = () => {
  const navigation = useNavigation<any>();
  const { lines, updateQty, remove } = useCart();
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setSelectedKeys((prev) => {
      const lineKeys = lines.map((l) => l.lineKey);
      const lineKeySet = new Set(lineKeys);
      const next = new Set<string>();

      for (const key of prev) {
        if (lineKeySet.has(key)) {
          next.add(key);
        }
      }
      for (const key of lineKeys) {
        if (!prev.has(key)) {
          next.add(key);
        }
      }
      if (prev.size === 0 && lineKeys.length > 0) {
        lineKeys.forEach((k) => next.add(k));
      }
      return next;
    });
  }, [lines]);

  const selectedLines = useMemo(
    () => lines.filter((l) => selectedKeys.has(l.lineKey)),
    [lines, selectedKeys],
  );

  const selectedTotal = useMemo(() => cartTotal(selectedLines), [selectedLines]);
  const allSelected = lines.length > 0 && selectedKeys.size === lines.length;

  const toggleLine = useCallback((lineKey: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(lineKey)) {
        next.delete(lineKey);
      } else {
        next.add(lineKey);
      }
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(lines.map((l) => l.lineKey)));
    }
  }, [allSelected, lines]);

  const goToCheckout = () => {
    if (selectedLines.length === 0) {
      return;
    }
    navigation.navigate(ROUTES.CHECKOUT, {
      lineKeys: selectedLines.map((l) => l.lineKey),
    });
  };

  if (lines.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }} edges={['top']}>
        <View style={{ paddingHorizontal: SPACING.md, paddingTop: SPACING.sm }}>
          <Text style={{ ...TYPO.title, color: COLORS.text }}>Your bag</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: COLORS.surface,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: SPACING.lg,
            }}
          >
            <Icon name="bag-outline" size={36} color={COLORS.textMuted} />
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.text }}>Your bag is empty</Text>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.textMuted,
              marginTop: SPACING.sm,
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            When you add sneakers, they&apos;ll show up here.
          </Text>
          <CustomButton
            label="Start shopping"
            variant="primary"
            mainStyle={{ marginTop: SPACING.xl, width: '100%' }}
            onPress={() => navigation.navigate(ROUTES.PRODUCTS)}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View
          style={{
            paddingHorizontal: SPACING.md,
            paddingBottom: SPACING.sm,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={{ ...TYPO.title, color: COLORS.text }}>Your bag</Text>
            <Text style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 2 }}>
              {selectedLines.length} of {lines.length} selected
            </Text>
          </View>
          <TouchableOpacity onPress={toggleSelectAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.primary }}>
              {allSelected ? 'Deselect all' : 'Select all'}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={lines}
          keyExtractor={(item) => item.lineKey}
          contentContainerStyle={{ padding: SPACING.md, paddingBottom: 160 }}
          renderItem={({ item }) => {
            const imageUri = item.imageUrl ?? resolveAssetUrl(item.image);
            const checked = selectedKeys.has(item.lineKey);
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  backgroundColor: COLORS.white,
                  borderRadius: RADIUS.lg,
                  padding: SPACING.md,
                  marginBottom: SPACING.md,
                  borderWidth: checked ? 1 : 1,
                  borderColor: checked ? COLORS.primary : COLORS.border,
                }}
              >
                <TouchableOpacity
                  onPress={() => toggleLine(item.lineKey)}
                  hitSlop={{ top: 8, bottom: 8, right: 8 }}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                  style={{ marginRight: SPACING.sm, paddingTop: 28 }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      borderWidth: 2,
                      borderColor: checked ? COLORS.primary : COLORS.border,
                      backgroundColor: checked ? COLORS.primary : COLORS.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {checked ? <Icon name="checkmark" size={16} color={COLORS.white} /> : null}
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    width: 88,
                    height: 88,
                    backgroundColor: COLORS.white,
                    borderRadius: RADIUS.md,
                    padding: SPACING.xs,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <Image
                    source={imageUri ? { uri: imageUri } : IMG.SHOESRUS_LOGO}
                    resizeMode="contain"
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: SPACING.md }}>
                  <Text style={{ fontWeight: '600', fontSize: 15, color: COLORS.text }} numberOfLines={2}>
                    {item.productName}
                  </Text>
                  <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
                    {item.color} · Size {item.size}
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 6 }}>
                    {formatPrice(cartLineSubtotal(item))}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: SPACING.sm,
                      gap: SPACING.sm,
                    }}
                  >
                    <QtyBtn onPress={() => updateQty(item.lineKey, item.quantity - 1)} label="−" />
                    <Text style={{ fontSize: 15, fontWeight: '600', minWidth: 24, textAlign: 'center' }}>
                      {item.quantity}
                    </Text>
                    <QtyBtn
                      onPress={() => updateQty(item.lineKey, item.quantity + 1)}
                      label="+"
                      disabled={item.quantity >= item.availableStock}
                    />
                    <TouchableOpacity onPress={() => remove(item.lineKey)} style={{ marginLeft: 'auto' }}>
                      <Text style={{ color: COLORS.textMuted, fontSize: 13, fontWeight: '500' }}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }}
        />

        <SafeAreaView
          edges={['bottom']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: COLORS.white,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            padding: SPACING.md,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md }}>
            <Text style={{ fontSize: 15, color: COLORS.textMuted }}>
              Subtotal ({selectedLines.length} item{selectedLines.length === 1 ? '' : 's'})
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.text }}>
              {formatPrice(selectedTotal)}
            </Text>
          </View>
          <CustomButton
            label={
              selectedLines.length === 0
                ? 'Select items to checkout'
                : `Checkout (${selectedLines.length})`
            }
            variant="primary"
            mainStyle={{
              width: '100%',
              opacity: selectedLines.length === 0 ? 0.55 : 1,
            }}
            disabled={selectedLines.length === 0}
            onPress={goToCheckout}
          />
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
};

function QtyBtn({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        width: 32,
        height: 32,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default CartScreen;
