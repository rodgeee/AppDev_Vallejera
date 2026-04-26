import React from 'react';
import { Text, TextInput, View } from 'react-native';
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
  ...rest
}: CustomTextInputProps) {
  return (
    <View style={[{ marginBottom: SPACING.lg }, containerStyle]}>
      <Text
        style={[
          {
            color: COLORS.text,
            fontSize: 14,
            fontWeight: '600',
            marginBottom: SPACING.sm,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
      <View
        style={{
          backgroundColor: COLORS.white,
          borderWidth: 1.5,
          borderColor: COLORS.border,
          borderRadius: RADIUS.md,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm,
        }}
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          value={value ?? ''}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          {...rest}
          style={[
            {
              color: COLORS.text,
              fontSize: 16,
              paddingVertical: 4,
              minHeight: 24,
            },
            TextInputStyle,
          ]}
        />
      </View>
    </View>
  );
}
