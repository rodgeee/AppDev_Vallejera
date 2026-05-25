import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

type CustomButtonProps = {
  label?: string;
  mainStyle?: any;
  textStyle?: any;
  route?: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'dark' | 'loginPrimary' | string;
  disabled?: boolean;
};

export default function CustomButton({
  label,
  mainStyle,
  textStyle,
  route,
  onPress,
  variant = 'primary',
  disabled = false,
}: CustomButtonProps) {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    if (disabled) return;
    if (onPress) {
      onPress();
    } else if (route) {
      navigation.navigate(route);
    }
  };

  const isLoginPrimary = variant === 'loginPrimary';

  const defaultMainStyle = {
    backgroundColor:
      variant === 'secondary'
        ? COLORS.success
        : variant === 'dark'
          ? COLORS.accent
          : COLORS.primary,
    paddingVertical: isLoginPrimary ? 16 : SPACING.md,
    paddingHorizontal: isLoginPrimary ? 20 : SPACING.xl,
    borderRadius: isLoginPrimary ? RADIUS.none : RADIUS.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...(isLoginPrimary ? {} : SHADOWS.sm),
  };

  const defaultTextStyle = {
    color: COLORS.white,
    fontSize: isLoginPrimary ? 13 : 16,
    fontWeight: isLoginPrimary ? '700' : '600',
    letterSpacing: isLoginPrimary ? 0.8 : 0,
    textTransform: isLoginPrimary ? 'uppercase' : 'none',
  };

  return (
    <TouchableOpacity
      style={[defaultMainStyle, mainStyle]}
      onPress={handlePress}
      activeOpacity={0.85}
      disabled={disabled}
    >
      <Text style={[defaultTextStyle, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}
