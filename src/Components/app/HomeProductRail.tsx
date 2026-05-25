import React from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from 'react-native';
import type { Product } from '../../app/api/types';
import ProductCard from '../ProductCard';
import { COLORS, SPACING } from '../../utils/theme';

const DEFAULT_CARD_WIDTH = Dimensions.get('window').width * 0.42;

type Props = {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
  onProductPress: (product: Product) => void;
  cardWidth?: number;
};

export default function HomeProductRail({
  products,
  loading = false,
  emptyMessage = 'Nothing here yet.',
  onProductPress,
  cardWidth = DEFAULT_CARD_WIDTH,
}: Props) {
  if (loading) {
    return <ActivityIndicator color={COLORS.primary} style={{ marginVertical: SPACING.lg }} />;
  }

  if (products.length === 0) {
    return (
      <Text style={{ color: COLORS.textMuted, textAlign: 'center', paddingVertical: SPACING.lg }}>
        {emptyMessage}
      </Text>
    );
  }

  return (
    <ScrollView
      horizontal
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: SPACING.md }}
    >
      {products.map((item, index) => (
        <ProductCard
          key={item.id}
          product={item}
          width={cardWidth}
          variant="compact"
          style={{ marginLeft: index === 0 ? 0 : SPACING.md }}
          onPress={() => onProductPress(item)}
        />
      ))}
    </ScrollView>
  );
}
