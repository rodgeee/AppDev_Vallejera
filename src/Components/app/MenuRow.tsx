import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING } from '../../utils/theme';

type Props = {
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
  showDivider?: boolean;
};

export default function MenuRow({
  icon,
  label,
  subtitle,
  onPress,
  destructive,
  showDivider = true,
}: Props) {
  const color = destructive ? COLORS.errorText : COLORS.text;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.65}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
        borderBottomWidth: showDivider ? 1 : 0,
        borderBottomColor: COLORS.border,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: COLORS.surface,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: SPACING.md,
        }}
      >
        <Icon name={icon} size={20} color={destructive ? COLORS.errorText : COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color }}>{label}</Text>
        {subtitle ? (
          <Text style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>{subtitle}</Text>
        ) : null}
      </View>
      {!destructive ? (
        <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
      ) : null}
    </TouchableOpacity>
  );
}
