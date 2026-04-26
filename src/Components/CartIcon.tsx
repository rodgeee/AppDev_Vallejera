import React from 'react';
import { View } from 'react-native';

/**
 * Simple shopping cart icon built with Views (no icon library required).
 */
type CartIconProps = {
  size?: number;
  color?: string;
  style?: any;
};

const CartIcon = ({ size = 24, color = '#000', style }: CartIconProps) => {
  const scale = size / 24;
  return (
    <View style={[{ width: size, height: size }, style]}>
      {/* Basket: open-top rounded rect */}
      <View
        style={{
          position: 'absolute',
          left: 2 * scale,
          top: 3 * scale,
          width: 12 * scale,
          height: 9 * scale,
          borderLeftWidth: 1.5 * scale,
          borderRightWidth: 1.5 * scale,
          borderBottomWidth: 1.5 * scale,
          borderColor: color,
          borderBottomLeftRadius: 3 * scale,
          borderBottomRightRadius: 3 * scale,
        }}
      />
      {/* Handle */}
      <View
        style={{
          position: 'absolute',
          top: 2 * scale,
          right: 1 * scale,
          width: 5 * scale,
          height: 1.5 * scale,
          backgroundColor: color,
          borderRadius: 1 * scale,
          transform: [{ rotate: '-25deg' }],
        }}
      />
      {/* Wheel */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 4 * scale,
          width: 5 * scale,
          height: 5 * scale,
          borderRadius: 2.5 * scale,
          borderWidth: 1.5 * scale,
          borderColor: color,
        }}
      />
    </View>
  );
};

export default CartIcon;
