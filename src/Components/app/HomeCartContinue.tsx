import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { resolveAssetUrl } from '../../app/api/client';
import type { CartLine } from '../../app/types/cart';
import { IMG } from '../../utils';
import { formatPrice } from '../../utils/format';
import { COLORS, RADIUS, SPACING } from '../../utils/theme';
import SectionHeader from './SectionHeader';

type Props = {
  lines: CartLine[];
  onViewBag: () => void;
  onLinePress: (productId: number) => void;
};

export default function HomeCartContinue({ lines, onViewBag, onLinePress }: Props) {
  const preview = lines.slice(0, 2);

  return (
    <View style={{ paddingHorizontal: SPACING.md }}>
      <SectionHeader title="Continue in your bag" actionLabel="View bag" onAction={onViewBag} />
      <View style={{ gap: SPACING.sm }}>
        {preview.map((line) => {
          const imageUri = line.imageUrl ?? resolveAssetUrl(line.image);
          return (
            <TouchableOpacity
              key={line.lineKey}
              activeOpacity={0.88}
              onPress={() => onLinePress(line.productId)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: COLORS.white,
                borderRadius: RADIUS.lg,
                borderWidth: 1,
                borderColor: COLORS.border,
                padding: SPACING.sm,
              }}
            >
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: RADIUS.md,
                  backgroundColor: COLORS.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <Image
                  source={imageUri ? { uri: imageUri } : IMG.SHOESRUS_LOGO}
                  resizeMode="contain"
                  style={{ width: '88%', height: '88%' }}
                />
              </View>
              <View style={{ flex: 1, marginLeft: SPACING.md, paddingRight: SPACING.sm }}>
                <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '700', color: COLORS.text }}>
                  {line.productName}
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
                  {line.color} · Size {line.size} · Qty {line.quantity}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.primary, marginTop: 4 }}>
                  {formatPrice(line.unitPrice)}
                </Text>
              </View>
              <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
