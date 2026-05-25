import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING, TYPO } from '../../utils/theme';

type Props = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function SectionHeader({ title, actionLabel, onAction }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
      }}
    >
      <Text style={{ ...TYPO.section, color: COLORS.text }}>{title}</Text>
      {actionLabel && onAction ? (
        <TouchableOpacity onPress={onAction} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={{ ...TYPO.caption, color: COLORS.textSecondary }}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
