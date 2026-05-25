import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Product } from '../../app/api/types';
import { getProductGalleryUris } from '../../utils/productImages';
import { IMG } from '../../utils';
import { COLORS, RADIUS, SPACING } from '../../utils/theme';

type Props = {
  product: Pick<Product, 'image' | 'images' | 'gallery' | 'imageUrl' | 'imageUrls' | 'galleryUrls'>;
  productName: string;
};

export default function ProductImageGallery({ product, productName }: Props) {
  const gallery = getProductGalleryUris(product);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const mainScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setActiveIndex(0);
    mainScrollRef.current?.scrollTo({ x: 0, animated: false });
  }, [product.image, product.images, product.gallery, product.imageUrl, product.galleryUrls]);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = Math.round(e.nativeEvent.layout.width);
    if (w > 0 && w !== slideWidth) {
      setSlideWidth(w);
    }
  };

  const onMainScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (slideWidth <= 0) {
      return;
    }
    const index = Math.round(e.nativeEvent.contentOffset.x / slideWidth);
    if (index >= 0 && index < gallery.length) {
      setActiveIndex(index);
    }
  };

  const goToIndex = (index: number) => {
    if (slideWidth <= 0) {
      return;
    }
    setActiveIndex(index);
    mainScrollRef.current?.scrollTo({ x: index * slideWidth, animated: true });
  };

  if (gallery.length === 0) {
    return (
      <View
        style={{
          marginHorizontal: SPACING.md,
          marginTop: SPACING.sm,
          borderRadius: RADIUS.lg,
          aspectRatio: 1,
          backgroundColor: COLORS.white,
          borderWidth: 1,
          borderColor: COLORS.border,
          padding: SPACING.xl,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image source={IMG.SHOESRUS_LOGO} resizeMode="contain" style={{ width: '70%', height: '70%' }} />
      </View>
    );
  }

  return (
    <View style={{ marginTop: SPACING.sm }}>
      <View
        onLayout={onLayout}
        style={{
          marginHorizontal: SPACING.md,
          borderRadius: RADIUS.lg,
          overflow: 'hidden',
          backgroundColor: COLORS.white,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        {slideWidth > 0 ? (
          <ScrollView
            ref={mainScrollRef}
            horizontal
            pagingEnabled
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onMainScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
            style={{ width: slideWidth }}
          >
            {gallery.map((uri, index) => (
              <View
                key={`slide-${index}-${uri}`}
                style={{
                  width: slideWidth,
                  aspectRatio: 1,
                  padding: SPACING.lg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.white,
                }}
              >
                <Image
                  source={{ uri }}
                  resizeMode="contain"
                  style={{ width: '100%', height: '100%' }}
                  accessibilityLabel={`${productName} image ${index + 1}`}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={{ aspectRatio: 1, padding: SPACING.lg }}>
            <Image
              source={{ uri: gallery[0] }}
              resizeMode="contain"
              style={{ width: '100%', height: '100%' }}
            />
          </View>
        )}

        {gallery.length > 1 ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 6,
              paddingVertical: SPACING.sm,
              backgroundColor: COLORS.white,
            }}
          >
            {gallery.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => goToIndex(i)} hitSlop={8}>
                <View
                  style={{
                    width: activeIndex === i ? 18 : 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: activeIndex === i ? COLORS.primary : COLORS.border,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>

      {gallery.length > 1 ? (
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: SPACING.md,
            paddingTop: SPACING.sm,
            gap: SPACING.sm,
          }}
        >
          {gallery.map((uri, index) => {
            const selected = index === activeIndex;
            return (
              <TouchableOpacity
                key={`thumb-${index}-${uri}`}
                onPress={() => goToIndex(index)}
                activeOpacity={0.85}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: RADIUS.md,
                  borderWidth: 2,
                  borderColor: selected ? COLORS.primary : COLORS.border,
                  backgroundColor: COLORS.white,
                  padding: SPACING.xs,
                  overflow: 'hidden',
                }}
              >
                <Image source={{ uri }} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : null}

      {gallery.length > 1 ? (
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: COLORS.textMuted,
            marginTop: SPACING.xs,
          }}
        >
          {activeIndex + 1} / {gallery.length} · swipe for more
        </Text>
      ) : null}
    </View>
  );
}
