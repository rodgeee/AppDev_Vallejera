import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { Product } from '../../app/api/types';
import { productImageSource } from '../../utils/productImages';
import { formatPrice } from '../../utils/format';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPO } from '../../utils/theme';

export type AddedToBagInfo = {
  product: Pick<Product, 'name' | 'color' | 'price' | 'image' | 'images'>;
  size: string;
  quantity: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onViewBag: () => void;
  item: AddedToBagInfo | null;
};

export function SelectSizeHintModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(17, 24, 39, 0.45)',
          justifyContent: 'center',
          padding: SPACING.lg,
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: COLORS.white,
            borderRadius: RADIUS.xl,
            padding: SPACING.lg,
            ...SHADOWS.lg,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={{ alignItems: 'center', marginBottom: SPACING.md }}>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: COLORS.primaryLight,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="resize-outline" size={26} color={COLORS.primary} />
            </View>
          </View>
          <Text style={{ ...TYPO.title, color: COLORS.text, textAlign: 'center' }}>Select a size</Text>
          <Text
            style={{
              fontSize: 15,
              color: COLORS.textSecondary,
              textAlign: 'center',
              marginTop: SPACING.sm,
              lineHeight: 22,
            }}
          >
            Choose your shoe size before adding this item to your bag.
          </Text>
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.85}
            style={{
              marginTop: SPACING.lg,
              backgroundColor: COLORS.primary,
              paddingVertical: 14,
              borderRadius: RADIUS.md,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '700' }}>Got it</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function AddedToBagModal({ visible, onClose, onViewBag, item }: Props) {
  if (!item) {
    return null;
  }

  const { product, size, quantity } = item;
  const qtyLabel = quantity > 1 ? ` × ${quantity}` : '';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(17, 24, 39, 0.45)',
          justifyContent: 'flex-end',
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: RADIUS.xl,
            borderTopRightRadius: RADIUS.xl,
            paddingTop: SPACING.sm,
            paddingHorizontal: SPACING.lg,
            paddingBottom: SPACING.xl,
            ...SHADOWS.lg,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: COLORS.border,
              alignSelf: 'center',
              marginBottom: SPACING.md,
            }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: COLORS.primaryLight,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: SPACING.md,
              }}
            >
              <Icon name="checkmark-circle" size={28} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.primary, letterSpacing: 0.3 }}>
                ADDED TO BAG
              </Text>
              <Text style={{ ...TYPO.title, color: COLORS.text, marginTop: 2 }}>You&apos;re all set</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={12} accessibilityLabel="Close">
              <Icon name="close" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLORS.primaryLight,
              borderRadius: RADIUS.lg,
              padding: SPACING.md,
              marginBottom: SPACING.lg,
              borderWidth: 1,
              borderColor: '#d4e0f5',
            }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: RADIUS.md,
                backgroundColor: COLORS.white,
                padding: SPACING.xs,
                marginRight: SPACING.md,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Image
                source={productImageSource(product)}
                resizeMode="contain"
                style={{ width: '100%', height: '100%' }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.text }} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4 }}>
                {product.color} · Size {size}
                {qtyLabel}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.primary, marginTop: 6 }}>
                {formatPrice(product.price)}
                {quantity > 1 ? ` · ${quantity} items` : ''}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              onClose();
              onViewBag();
            }}
            activeOpacity={0.88}
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: 16,
              borderRadius: RADIUS.md,
              alignItems: 'center',
              marginBottom: SPACING.sm,
            }}
          >
            <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '700' }}>View bag</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.88}
            style={{
              paddingVertical: 14,
              borderRadius: RADIUS.md,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: COLORS.border,
              backgroundColor: COLORS.white,
            }}
          >
            <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600' }}>Continue shopping</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
