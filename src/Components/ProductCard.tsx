import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import type { Product } from '../app/api/types';
import { productImageSource } from '../utils/productImages';
import { formatPrice } from '../utils/format';
import { COLORS, RADIUS, SPACING } from '../utils/theme';

type Props = {
  product: Product;
  width: number;
  onPress?: () => void;
  style?: object;
  variant?: 'grid' | 'compact';
};

const ProductCard = ({ product, width, onPress, style, variant = 'grid' }: Props) => {
  const outOfStock = product.availableStock <= 0;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      disabled={!onPress}
      style={[{ width }, style]}
    >
      <View
        style={{
          backgroundColor: COLORS.white,
          borderRadius: RADIUS.lg,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <View
          style={{
            width: '100%',
            aspectRatio: variant === 'compact' ? 1.05 : 1,
            padding: SPACING.md,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.white,
          }}
        >
          <Image
            source={productImageSource(product)}
            resizeMode="contain"
            style={{ width: '100%', height: '100%' }}
          />
          {outOfStock ? (
            <View
              style={{
                position: 'absolute',
                top: SPACING.sm,
                left: SPACING.sm,
                backgroundColor: COLORS.primary,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: RADIUS.sm,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.white }}>SOLD OUT</Text>
            </View>
          ) : null}
        </View>
      </View>
      <View style={{ paddingTop: SPACING.sm, paddingHorizontal: variant === 'grid' ? 2 : 0 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }} numberOfLines={1}>
          {product.color} · {product.size}
        </Text>
        <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.primary, marginTop: 4 }}>
          {formatPrice(product.price)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
