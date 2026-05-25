import React from 'react';
import { Dimensions, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { IMG } from '../../utils';
import { COLORS, RADIUS, SPACING } from '../../utils/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PANEL_WIDTH = (SCREEN_WIDTH - SPACING.md * 2 - SPACING.sm) / 2;
const PANEL_HEIGHT = PANEL_WIDTH * 1.35;

const SPOTLIGHTS = [
  {
    brand: 'NIKE',
    image: IMG.BRAND_SPOTLIGHT_NIKE,
    eyebrow: 'Brands you love',
    title: 'Nike',
    description: 'Icons and collabs, built for the spotlight.',
    cta: 'Shop Nike',
  },
  {
    brand: 'NEW BALANCE',
    image: IMG.BRAND_SPOTLIGHT_NEW_BALANCE,
    eyebrow: 'Brands you know',
    title: 'New Balance',
    description: 'Heritage comfort with a modern stride.',
    cta: 'Shop NB',
  },
] as const;

type Props = {
  onBrandPress: (brand: string) => void;
};

export default function HomeBrandSpotlight({ onBrandPress }: Props) {
  return (
    <View style={{ paddingHorizontal: SPACING.md }}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          color: COLORS.textMuted,
          marginBottom: 4,
          textAlign: 'center',
        }}
      >
        Editorial picks
      </Text>
      <Text
        style={{
          fontSize: 17,
          fontWeight: '700',
          color: COLORS.text,
          marginBottom: SPACING.md,
          textAlign: 'center',
        }}
      >
        Brands that define the season
      </Text>
      <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
        {SPOTLIGHTS.map((spot) => (
          <TouchableOpacity
            key={spot.brand}
            activeOpacity={0.9}
            onPress={() => onBrandPress(spot.brand)}
            style={{
              width: PANEL_WIDTH,
              height: PANEL_HEIGHT,
              borderRadius: RADIUS.lg,
              overflow: 'hidden',
              backgroundColor: COLORS.heroFallback,
            }}
          >
            <ImageBackground source={spot.image} resizeMode="cover" style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  padding: SPACING.sm,
                  backgroundColor: 'rgba(15, 23, 42, 0.55)',
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: '600',
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  {spot.eyebrow}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '800',
                    color: COLORS.white,
                    marginTop: 4,
                    letterSpacing: -0.3,
                  }}
                >
                  {spot.title}
                </Text>
                <Text
                  numberOfLines={3}
                  style={{
                    fontSize: 10,
                    lineHeight: 14,
                    color: 'rgba(248,250,252,0.88)',
                    marginTop: 4,
                  }}
                >
                  {spot.description}
                </Text>
                <View
                  style={{
                    marginTop: SPACING.sm,
                    alignSelf: 'flex-start',
                    backgroundColor: COLORS.white,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: RADIUS.full,
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.text }}>{spot.cta}</Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
