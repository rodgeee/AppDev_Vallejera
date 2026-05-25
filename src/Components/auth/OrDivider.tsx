import React from 'react';
import { Text, View } from 'react-native';
import { COLORS, LOGIN } from '../../utils/theme';

export default function OrDivider() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16,
      }}
      accessibilityRole="text"
      accessibilityLabel="Alternative sign-in"
    >
      <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
      <Text
        style={{
          color: COLORS.textSecondary,
          fontSize: LOGIN.dividerSize,
          fontWeight: '700',
          letterSpacing: 1.3,
          textTransform: 'uppercase',
        }}
      >
        Or
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
    </View>
  );
}
