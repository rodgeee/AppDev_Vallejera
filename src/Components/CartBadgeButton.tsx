import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import CartIcon from './CartIcon';
import { COLORS } from '../utils/theme';

type Props = {
  count: number;
  onPress: () => void;
  size?: number;
  color?: string;
};

const CartBadgeButton = ({ count, onPress, size = 22, color = COLORS.text }: Props) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ padding: 4 }}>
    <CartIcon size={size} color={color} />
    {count > 0 ? (
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          minWidth: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: COLORS.accent,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 4,
        }}
      >
        <Text style={{ color: COLORS.white, fontSize: 10, fontWeight: '700' }}>
          {count > 99 ? '99+' : count}
        </Text>
      </View>
    ) : null}
  </TouchableOpacity>
);

export default CartBadgeButton;
