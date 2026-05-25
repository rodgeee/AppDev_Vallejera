import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, RADIUS, SPACING } from '../../utils/theme';

type Props = {
  value?: string;
  placeholder?: string;
  editable?: boolean;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
};

export default function SearchField({
  value,
  placeholder = 'Search sneakers, brands…',
  editable = true,
  onChangeText,
  onPress,
}: Props) {
  const inner = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.full,
        paddingHorizontal: SPACING.md,
        paddingVertical: 12,
        gap: SPACING.sm,
      }}
    >
      <Icon name="search-outline" size={20} color={COLORS.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        editable={editable && !onPress}
        pointerEvents={onPress ? 'none' : 'auto'}
        style={{
          flex: 1,
          fontSize: 15,
          color: COLORS.text,
          padding: 0,
        }}
      />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        {inner}
      </TouchableOpacity>
    );
  }
  return inner;
}
