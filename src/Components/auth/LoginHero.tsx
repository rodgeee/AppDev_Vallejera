import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import { COLORS } from '../../utils/theme';
import images from '../../utils/images';

const HERO_HEIGHT = Math.round(Dimensions.get('window').height * 0.38);

export default function LoginHero() {
  return (
    <View
      style={{
        height: HERO_HEIGHT,
        minHeight: 220,
        backgroundColor: COLORS.heroFallback,
      }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Image
        source={images.LOGIN_HERO}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}
