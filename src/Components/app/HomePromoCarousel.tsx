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
import type { HomePromoSlide } from '../../constants/homePromo';
import { COLORS, RADIUS, SPACING } from '../../utils/theme';

const AUTO_INTERVAL_MS = 5500;

type Props = {
  slides: HomePromoSlide[];
  onPressSlide: (slide: HomePromoSlide, index: number) => void;
  height: number;
};

function SalePromoSlide({ slide }: { slide: HomePromoSlide }) {
  const source = typeof slide.image === 'number' ? slide.image : slide.image;

  return (
    <Image
      source={source}
      resizeMode="cover"
      style={{ width: '100%', height: '100%' }}
      accessibilityLabel="Promotion"
    />
  );
}

function ProductPromoSlide({ slide }: { slide: HomePromoSlide }) {
  const source = typeof slide.image === 'number' ? slide.image : slide.image;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 48,
          zIndex: 1,
          paddingHorizontal: SPACING.md,
          paddingTop: SPACING.md,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: '700',
            color: COLORS.primary,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}
        >
          {slide.eyebrow}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '800',
            color: COLORS.text,
            marginTop: 2,
            lineHeight: 18,
          }}
          numberOfLines={2}
        >
          {slide.title}
        </Text>
        {slide.subtitle ? (
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: COLORS.textSecondary,
              marginTop: 2,
              textTransform: 'uppercase',
            }}
            numberOfLines={1}
          >
            {slide.subtitle}
          </Text>
        ) : null}
      </View>

      <Image
        source={source}
        resizeMode="contain"
        style={{ width: '100%', height: '100%' }}
        accessibilityLabel={slide.title}
      />
    </View>
  );
}

function PromoSlideContent({ slide }: { slide: HomePromoSlide }) {
  if (slide.variant === 'product') {
    return <ProductPromoSlide slide={slide} />;
  }
  return <SalePromoSlide slide={slide} />;
}

export default function HomePromoCarousel({ slides, onPressSlide, height }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const count = slides.length;

  useEffect(() => {
    setActiveIndex(0);
    scrollRef.current?.scrollTo({ x: 0, animated: false });
  }, [slides.length, slides.map((s) => s.id).join(',')]);

  useEffect(() => {
    if (count <= 1 || slideWidth <= 0) {
      return undefined;
    }
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % count;
        scrollRef.current?.scrollTo({ x: next * slideWidth, animated: true });
        return next;
      });
    }, AUTO_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [count, slideWidth]);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = Math.round(e.nativeEvent.layout.width);
    if (w > 0) {
      setSlideWidth(w);
    }
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (slideWidth <= 0) {
      return;
    }
    const index = Math.round(e.nativeEvent.contentOffset.x / slideWidth);
    if (index >= 0 && index < count) {
      setActiveIndex(index);
    }
  };

  const goTo = (index: number) => {
    if (slideWidth <= 0) {
      return;
    }
    setActiveIndex(index);
    scrollRef.current?.scrollTo({ x: index * slideWidth, animated: true });
  };

  if (count === 0) {
    return null;
  }

  return (
    <View
      onLayout={onLayout}
      style={{
        marginHorizontal: SPACING.md,
        marginTop: SPACING.md,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        height,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      {slideWidth > 0 ? (
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          scrollEventThrottle={16}
          decelerationRate="fast"
          style={{ width: slideWidth, height }}
        >
          {slides.map((slide, index) => (
            <TouchableOpacity
              key={slide.id}
              activeOpacity={0.92}
              onPress={() => onPressSlide(slide, index)}
              style={{ width: slideWidth, height }}
            >
              <PromoSlideContent slide={slide} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => onPressSlide(slides[0], 0)}
          style={{ flex: 1 }}
        >
          <PromoSlideContent slide={slides[0]} />
        </TouchableOpacity>
      )}

      {count > 1 ? (
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            top: SPACING.md,
            right: SPACING.md,
            flexDirection: 'row',
            gap: 6,
          }}
        >
          {slides.map((_, i) => {
            const isActive = activeIndex === i;
            const productDots = slides[i]?.variant === 'product';
            return (
              <TouchableOpacity key={i} onPress={() => goTo(i)} hitSlop={8}>
                <View
                  style={{
                    width: isActive ? 18 : 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: productDots
                      ? isActive
                        ? COLORS.primary
                        : COLORS.border
                      : isActive
                        ? COLORS.white
                        : 'rgba(255,255,255,0.45)',
                    borderWidth: !productDots && !isActive ? 1 : 0,
                    borderColor: 'rgba(255,255,255,0.6)',
                  }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
