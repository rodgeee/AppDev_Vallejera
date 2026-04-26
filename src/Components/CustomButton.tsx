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
  variant?: 'primary' | 'secondary' | string;
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

  const defaultMainStyle = {
    backgroundColor: variant === 'primary' ? COLORS.primary : COLORS.success,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  };

  const defaultTextStyle = {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
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
