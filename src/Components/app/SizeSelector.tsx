import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../utils/theme';

type Props = {
  sizes: string[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
};

export function sortShoeSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) {
      return na - nb;
    }
    return a.localeCompare(b, undefined, { numeric: true });
  });
}

export default function SizeSelector({ sizes, selectedSize, onSelect }: Props) {
  const sorted = sortShoeSizes(sizes);

  if (sorted.length === 0) {
    return null;
  }

  return (
    <View style={{ marginTop: SPACING.lg }}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm }}>
        Select size (US)
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: SPACING.sm, paddingRight: SPACING.md }}>
          {sorted.map((size) => {
            const selected = size === selectedSize;
            return (
              <TouchableOpacity
                key={size}
                onPress={() => onSelect(size)}
                activeOpacity={0.8}
                style={{
                  minWidth: 52,
                  paddingHorizontal: SPACING.md,
                  paddingVertical: 12,
                  borderRadius: RADIUS.md,
                  borderWidth: 2,
                  borderColor: selected ? COLORS.primary : COLORS.border,
                  backgroundColor: selected ? COLORS.primary : COLORS.white,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    textAlign: 'center',
                    color: selected ? COLORS.white : COLORS.text,
                  }}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
