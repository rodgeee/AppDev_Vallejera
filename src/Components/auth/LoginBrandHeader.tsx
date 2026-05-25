import React from 'react';
import { Image, View } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../../utils/theme';
import images from '../../utils/images';

export default function LoginBrandHeader() {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOWS.header,
      }}
    >
      <Image
        source={images.SHOESRUS_LOGO}
        style={{ width: 90, height: 30 }}
        resizeMode="contain"
        accessibilityLabel="Shoes R' Us"
      />
    </View>
  );
}
