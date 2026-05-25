import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, RADIUS, SPACING } from '../../utils/theme';

const ITEMS = [
  { icon: 'shield-checkmark-outline' as const, label: 'Authentic pairs' },
  { icon: 'lock-closed-outline' as const, label: 'Secure checkout' },
  { icon: 'cube-outline' as const, label: 'Order tracking' },
];

export default function HomeTrustStrip() {
  return (
    <View
      style={{
        marginHorizontal: SPACING.md,
        marginTop: SPACING.xl,
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.sm,
      }}
    >
      {ITEMS.map((item, index) => (
        <View
          key={item.label}
          style={{
            flex: 1,
            alignItems: 'center',
            borderRightWidth: index < ITEMS.length - 1 ? 1 : 0,
            borderRightColor: COLORS.border,
          }}
        >
          <Icon name={item.icon} size={22} color={COLORS.primary} />
          <Text
            style={{
              fontSize: 10,
              fontWeight: '600',
              color: COLORS.textSecondary,
              marginTop: 6,
              textAlign: 'center',
              paddingHorizontal: 4,
            }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
