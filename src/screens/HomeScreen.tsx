import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchProducts } from '../app/api/products';
import { useAppAlert } from '../app/context/AppAlertContext';
import type { Product } from '../app/api/types';
import { useAuthToken } from '../app/hooks/useAuthToken';
import { useCart } from '../app/hooks/useCart';
import HomeBrandSpotlight from '../Components/app/HomeBrandSpotlight';
import HomeCartContinue from '../Components/app/HomeCartContinue';
import HomeProductRail from '../Components/app/HomeProductRail';
import HomePromoCarousel from '../Components/app/HomePromoCarousel';
import HomeTrustStrip from '../Components/app/HomeTrustStrip';
import SearchField from '../Components/app/SearchField';
import SectionHeader from '../Components/app/SectionHeader';
import { BRAND_NAMES } from '../constants/brands';
import { HOME_SALE_SLIDE } from '../constants/homePromo';
import { ROUTES } from '../utils';
import { greetingForHour } from '../utils/strings';
import { COLORS, RADIUS, SPACING } from '../utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PROMO_HEIGHT = SCREEN_WIDTH * 0.58;
const LOW_STOCK_MAX = 3;
const PRODUCT_FETCH_LIMIT = 40;

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const token = useAuthToken();
  const { lines: cartLines } = useCart();
  const { alert } = useAppAlert();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const loadProducts = useCallback(async () => {
    if (!token) {
      setLoadingProducts(false);
      return;
    }
    setLoadingProducts(true);
    try {
      const data = await fetchProducts(token, { limit: PRODUCT_FETCH_LIMIT });
      setProducts(data);
    } catch (err: unknown) {
      setProducts([]);
      const msg = err instanceof Error ? err.message : 'Could not load products.';
      alert('Shop unavailable', msg);
    } finally {
      setLoadingProducts(false);
    }
  }, [token, alert]);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts]),
  );

  const promoSlides = useMemo(() => [HOME_SALE_SLIDE], []);

  const almostGone = useMemo(
    () =>
      products.filter((p) => p.availableStock > 0 && p.availableStock <= LOW_STOCK_MAX).slice(0, 8),
    [products],
  );

  const openShop = (brand?: string) => {
    navigation.navigate(ROUTES.PRODUCTS, brand ? { brand } : undefined);
  };

  const openProduct = (productId: number) => {
    navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId });
  };

  const openBag = () => {
    navigation.navigate(ROUTES.CART);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: SPACING.xxl }}
        >
          <View style={{ paddingHorizontal: SPACING.md, paddingTop: SPACING.xs }}>
            <Text
              style={{
                fontSize: 13,
                color: COLORS.textMuted,
                fontWeight: '500',
              }}
            >
              {greetingForHour()}
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '800',
                color: COLORS.text,
                marginTop: 2,
                letterSpacing: -0.3,
              }}
            >
              Find your pair
            </Text>
            <View style={{ marginTop: SPACING.md }}>
              <SearchField onPress={() => openShop()} />
            </View>
          </View>

          <HomePromoCarousel
            slides={promoSlides}
            height={PROMO_HEIGHT}
            onPressSlide={() => openShop()}
          />

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigation.navigate(ROUTES.SHOE_SERVICES)}
            style={{
              marginHorizontal: SPACING.md,
              marginTop: SPACING.md,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLORS.primaryLight,
              borderRadius: RADIUS.lg,
              padding: SPACING.md,
              borderWidth: 1,
              borderColor: '#d4e0f5',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 0.8, color: COLORS.primary }}>
                CARE LAB
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 4 }}>
                Professional shoe cleaning
              </Text>
              <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4 }}>
                Browse packages & book a clean — track jobs in Account
              </Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.primary }}>View</Text>
          </TouchableOpacity>

          <View style={{ paddingHorizontal: SPACING.md, marginTop: SPACING.xl }}>
            <SectionHeader title="Fresh drops" actionLabel="See all" onAction={() => openShop()} />
            <HomeProductRail
              products={products.slice(0, 10)}
              loading={loadingProducts}
              emptyMessage="No products yet. Check back soon."
              onProductPress={(item) => openProduct(item.id)}
            />
          </View>

          {cartLines.length > 0 ? (
            <View style={{ marginTop: SPACING.xl }}>
              <HomeCartContinue
                lines={cartLines}
                onViewBag={openBag}
                onLinePress={openProduct}
              />
            </View>
          ) : null}

          {almostGone.length > 0 ? (
            <View style={{ paddingHorizontal: SPACING.md, marginTop: SPACING.xl }}>
              <SectionHeader title="Almost gone" actionLabel="Shop all" onAction={() => openShop()} />
              <HomeProductRail
                products={almostGone}
                emptyMessage="No low-stock items right now."
                onProductPress={(item) => openProduct(item.id)}
              />
            </View>
          ) : null}

          <View style={{ marginTop: SPACING.xl }}>
            <HomeBrandSpotlight onBrandPress={(brand) => openShop(brand)} />
          </View>

          <View style={{ paddingHorizontal: SPACING.md, marginTop: SPACING.xl }}>
            <SectionHeader
              title="Popular brands"
              actionLabel="Browse"
              onAction={() => navigation.navigate(ROUTES.BRANDS)}
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>
              {BRAND_NAMES.slice(0, 6).map((brand) => (
                <TouchableOpacity
                  key={brand}
                  onPress={() => openShop(brand)}
                  activeOpacity={0.85}
                  style={{
                    width: (SCREEN_WIDTH - SPACING.md * 2 - SPACING.sm) / 2 - SPACING.sm / 2,
                    backgroundColor: COLORS.white,
                    borderRadius: RADIUS.md,
                    paddingVertical: SPACING.lg,
                    paddingHorizontal: SPACING.md,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.text }}>
                    {brand
                      .split(' ')
                      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
                      .join(' ')}
                  </Text>
                  <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
                    Shop collection
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <HomeTrustStrip />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
