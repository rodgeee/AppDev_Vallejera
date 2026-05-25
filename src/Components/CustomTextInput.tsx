import React, { useMemo, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

type CustomTextInputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  textStyle?: any;
  TextInputStyle?: any;
  containerStyle?: any;
  secureTextEntry?: boolean;
  maxLength?: number;
  /** Web login style: gray fill, square corners, 15px label (srusystem login.html.twig). */
  variant?: 'default' | 'login';
  [key: string]: any;
};

export default function CustomTextInput({
  label,
  placeholder,
  value,
  onChangeText,
  textStyle,
  TextInputStyle,
  containerStyle,
  secureTextEntry,
  maxLength,
  variant = 'default',
  ...rest
}: CustomTextInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isSecureInput = Boolean(secureTextEntry);
  const shouldMaskPassword = useMemo(
    () => (isSecureInput ? !isPasswordVisible : false),
    [isPasswordVisible, isSecureInput],
  );

  const isLogin = variant === 'login';

  return (
    <View style={[{ marginBottom: isLogin ? 16 : SPACING.lg }, containerStyle]}>
      {label ? (
        <Text
          style={[
            {
              color: COLORS.text,
              fontSize: isLogin ? 15 : 14,
              fontWeight: isLogin ? '400' : '600',
              marginBottom: isLogin ? 4 : SPACING.sm,
            },
            textStyle,
          ]}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={{
          backgroundColor: isLogin ? COLORS.fieldBg : COLORS.white,
          borderWidth: isLogin ? 1 : 1.5,
          borderColor: isLogin ? 'transparent' : COLORS.border,
          borderRadius: isLogin ? RADIUS.none : RADIUS.md,
          paddingHorizontal: isLogin ? 16 : SPACING.md,
          paddingVertical: isLogin ? 14 : SPACING.sm,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          value={value ?? ''}
          onChangeText={onChangeText}
          secureTextEntry={shouldMaskPassword}
          maxLength={maxLength}
          {...rest}
          style={[
            {
              color: COLORS.text,
              fontSize: isLogin ? 15 : 16,
              paddingVertical: isLogin ? 0 : 4,
              minHeight: isLogin ? 22 : 24,
              flex: 1,
            },
            TextInputStyle,
          ]}
        />
        {isSecureInput ? (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(previous => !previous)}
            activeOpacity={0.7}
            style={{ marginLeft: SPACING.sm, padding: 4 }}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
