import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../utils/theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export default function BrandChip({ label, selected, onPress }: Props) {
  const title = label.charAt(0) + label.slice(1).toLowerCase();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        borderRadius: RADIUS.full,
        backgroundColor: selected ? COLORS.primary : COLORS.white,
        borderWidth: 1,
        borderColor: selected ? COLORS.primary : COLORS.border,
        marginRight: SPACING.sm,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: selected ? COLORS.white : COLORS.text,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
